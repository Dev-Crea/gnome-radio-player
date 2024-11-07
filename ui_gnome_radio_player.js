import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import UIChannelList from './ui_channel_list.js';
import UIPopup from './ui_popup.js';
import {list_channels, favorite_channels} from './data.js';

const UIGnomeRadioPlayer = GObject.registerClass(
    {
        GTypeName: 'UIGnomeRadioPlayer',
    },
    class extends PanelMenu.Button {
        static popup;
        static menus;
        static favorites;
        static channels;

        _init() {
            super._init(0.0);

            let buttons_box = new St.BoxLayout({
                style_class: 'panel-status-menu-box',
            });

            let icon = new St.Icon({
                icon_name: 'de.haeckerfelix.gradio-symbolic',
                style_class: 'system-status-icon',
            });

            buttons_box.add_child(icon);

            this.add_child(buttons_box);
            this.add_style_class_name('panel-status-button');

            UIGnomeRadioPlayer.popup = new UIPopup();

            UIGnomeRadioPlayer.menus = this.menu;
            UIGnomeRadioPlayer.favorites =
                UIGnomeRadioPlayer._list_channels_favorites();
            UIGnomeRadioPlayer.channels =
                UIGnomeRadioPlayer._list_channels_radio();

            UIGnomeRadioPlayer.menus.addMenuItem(UIGnomeRadioPlayer.popup);
            UIGnomeRadioPlayer.menus.addMenuItem(
                new PopupMenu.PopupSeparatorMenuItem()
            );
            UIGnomeRadioPlayer.menus.addMenuItem(UIGnomeRadioPlayer.favorites);
            UIGnomeRadioPlayer.menus.addMenuItem(UIGnomeRadioPlayer.channels);
        }

        static _list_channels_favorites() {
            return new UIChannelList(_('Favorites'), favorite_channels());
        }

        static _list_channels_radio() {
            return new UIChannelList(_('Radios'), list_channels());
        }

        static updateListChannel() {
            this.favorites.destroy();
            this.channels.destroy();

            this.favorites = this._list_channels_favorites();
            this.channels = this._list_channels_radio();

            this.menus.addMenuItem(this.favorites);
            this.menus.addMenuItem(this.channels);
        }
    }
);

export default UIGnomeRadioPlayer;
