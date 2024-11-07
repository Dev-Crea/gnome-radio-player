import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

import * as Radio from './radio.js';
import {player} from './extension.js';
import {currentChannel} from './radio.js';
import {setFavorite} from './data.js';
import UIGnomeRadioPlayer from './ui_gnome_radio_player.js';
import UILoading from './ui_loading.js';

const UIPlayerControl = GObject.registerClass(
    {
        GTypeName: 'UIPlayerControl',
    },
    class extends St.BoxLayout {
        static label_channel;
        static play_or_stop;
        static favorite;
        static playing = false;

        _init() {
            super._init({
                vertical: false,
                x_align: Clutter.ActorAlign.CENTER,
                x_expand: true,
                width: 250,
            });

            UIPlayerControl.play_or_stop = new St.Icon({
                style_class: 'icon',
                icon_name: 'media-playback-stop-symbolic',
                reactive: true,
                width: 50,
            });

            UIPlayerControl.label_channel = new St.Label({
                style_class: 'gnome-radio-player-box-ui_label_channel',
                text: currentChannel.name,
                y_align: Clutter.ActorAlign.CENTER,
                x_align: Clutter.ActorAlign.CENTER,
                reactive: true,
                x_expand: true,
            });

            UIPlayerControl.favorite = new St.Icon({
                style_class: 'icon',
                icon_name: UIPlayerControl.icon_favorite(),
                reactive: true,
                width: 50,
            });

            this.add_child(UIPlayerControl.play_or_stop);
            this.add_child(UIPlayerControl.label_channel);
            this.add_child(UIPlayerControl.favorite);

            this._events();
        }

        stop() {
            player.stop();
            this._change_channel('', 'media-playback-start-symbolic');
        }

        start() {
            player.play();
            this._change_channel(
                currentChannel.name,
                'media-playback-stop-symbolic'
            );
        }

        _change_channel(label, logo) {
            UIPlayerControl.label_channel.set_text(label);
            UIPlayerControl.play_or_stop.set_icon_name(logo);
            UIPlayerControl.playing = !UIPlayerControl.playing;
        }

        _events() {
            UIPlayerControl.play_or_stop.connect('button-press-event', () => {
                if (UIPlayerControl.playing) {
                    UIPlayerControl.update_stop();
                    player.stop();
                } else {
                    UILoading.setLoading(true);
                    UIPlayerControl.update_play();
                    player.play();
                }
            });

            UIPlayerControl.favorite.connect('button-press-event', () => {
                currentChannel.favorite = !currentChannel.favorite;
                setFavorite(currentChannel.name);
                UIPlayerControl.favorite.set_icon_name(
                    UIPlayerControl.icon_favorite()
                );

                UIGnomeRadioPlayer.updateListChannel();
            });
        }

        static update_play() {
            this.label_channel.set_text(currentChannel.name);
            this.play_or_stop.set_icon_name('media-playback-stop-symbolic');
            this.favorite.set_icon_name(this.icon_favorite());
            this.playing = true;
        }

        static update_stop() {
            this.label_channel.set_text('');
            this.play_or_stop.set_icon_name('media-playback-start-symbolic');
            this.playing = false;
        }

        static icon_favorite() {
            return !currentChannel.favorite
                ? 'love-symbolic'
                : 'emote-love-symbolic';
        }
    }
);

export default UIPlayerControl;
