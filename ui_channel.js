import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {player} from './extension.js';
import {path_asset} from './data.js';

const UIChannel = GObject.registerClass(
    {
        GTypeName: 'UIChannel',
    },
    class extends PopupMenu.PopupBaseMenuItem {
        _init(channel) {
            super._init({
                reactive: true,
                can_focus: true,
            });

            this.channel = channel;

            this.channel_box = new St.BoxLayout({vertical: false});
            this.add_child(this.channel_box);

            let channel_icon = new St.Icon({
                gicon: Gio.icon_new_for_string(
                    path_asset() + this.channel.logo
                ),
                style: 'margin-right:10px',
                icon_size: 60,
            });

            let channel_title = new St.Label({
                text: this.channel.name,
                y_align: Clutter.ActorAlign.CENTER,
                y_expand: true,
            });

            let box_title = new St.BoxLayout({vertical: false});

            this.channel_box.add_child(channel_icon);
            this.channel_box.add_child(box_title);

            box_title.add_child(channel_title);
        }

        activate(_event) {
            player.stop();
            player.setChannel(this.channel);
            player.play();
        }
    }
);

export default UIChannel;
