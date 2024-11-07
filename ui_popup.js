import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import UIVolume from './ui_volume.js';
import UILoading from './ui_loading.js';
import UIPlayerInfo from './ui_player_info.js';
import UIPlayerControl from './ui_player_control.js';
import UIFirstStart from './ui_first_start.js';

const UIPopup = GObject.registerClass(
    {
        GTypeName: 'UIPopup',
    },
    class extends PopupMenu.PopupBaseMenuItem {
        static box_volume;
        static box_loading;
        static box_player_control;
        static box_player_info;
        static box_default_start;

        _init() {
            super._init({
                hover: false,
                activate: false,
                can_focus: false,
            });

            this.box = new St.BoxLayout({
                style_class: 'gnome-radio-player-box',
                vertical: true,
                width: 250,
            });

            UIPopup.box_volume = new UIVolume();
            UIPopup.box_loading = new UILoading();
            UIPopup.box_player_control = new UIPlayerControl();
            UIPopup.box_player_info = new UIPlayerInfo();
            UIPopup.box_default_start = new UIFirstStart();

            this.box.add_child(UIPopup.box_default_start);
            this.box.add_child(UIPopup.box_loading);
            this.box.add_child(UIPopup.box_volume);
            this.box.add_child(UIPopup.box_player_control);
            this.box.add_child(UIPopup.box_player_info);

            this.add_child(this.box);

            UIPopup.update_stop();
        }

        static update_play() {
            this.box_loading.show();
            this.box_default_start.hide();

            this.box_volume.show();
            this.box_player_control.show();
            this.box_player_info.show();
        }

        static update_stop() {
            this.box_loading.show();
            this.box_default_start.show();

            this.box_volume.hide();
            this.box_player_control.hide();
            this.box_player_info.show();
        }
    }
);

export default UIPopup;
