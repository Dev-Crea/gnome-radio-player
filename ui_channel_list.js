import {
    Extension,
    gettext as _,
} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import UIChannel from './ui_channel.js';

const UIChannelList = GObject.registerClass(
    {
        GTypeName: 'UIChannelList',
    },
    class extends PopupMenu.PopupSubMenuMenuItem {
        _init(label, channels) {
            super._init(label);

            if (channels.length === 0) {
                this._list_empty();
            } else {
                this._list_channel(channels);
            }
        }

        _list_channel(channels) {
            channels.forEach(channel => {
                this.menu.addMenuItem(new UIChannel(channel));
            });
        }

        _list_empty() {
            let element = new PopupMenu.PopupBaseMenuItem({
                reactive: true,
                can_focus: true,
            });
            element.add_child(new St.Label({text: _('No favorite')}));
            this.menu.addMenuItem(element);
        }
    }
);

export default UIChannelList;
