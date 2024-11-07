import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {player} from './extension.js';
import {currentChannel} from './radio.js';

import {path_asset} from './data.js';

const UIPlayerInfo = GObject.registerClass(
    {
        GTypeName: 'UIPlayerInfo',
    },
    class extends St.BoxLayout {
        static logo_radio;

        _init() {
            super._init({
                vertical: true,
                x_align: Clutter.ActorAlign.CENTER,
                x_expand: true,
                style: 'margin: 10px',
                width: 230,
            });

            UIPlayerInfo.logo_radio = new St.Icon({
                gicon: Gio.icon_new_for_string(
                    path_asset() + '/assets/default.svg'
                ),
                style_class: 'icon',
                y_align: Clutter.ActorAlign.CENTER,
                icon_size: 230,
            });

            this.add_child(UIPlayerInfo.logo_radio);
        }

        static update_play() {
            this.logo_radio.set_gicon(
                Gio.icon_new_for_string(path_asset() + currentChannel.logo)
            );
        }

        static update_stop() {
            this.logo_radio.set_gicon(
                Gio.icon_new_for_string(path_asset() + '/assets/default.svg')
            );
        }
    }
);

export default UIPlayerInfo;
