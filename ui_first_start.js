import {
    Extension,
    gettext as _,
} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

/**
 * Class for display a message when start first extension
 */
const UIFirstStart = GObject.registerClass(
    {
        GTypeName: 'UIFirstStart',
    },
    class extends St.BoxLayout {
        _init(player) {
            super._init({
                style_class: 'gnome-radio-player-box-ui_first_start',
                vertical: true,
                width: 250,
            });

            this.label_default_start = new St.Label({
                text: _('Select a radio in list.'),
                y_align: Clutter.ActorAlign.CENTER,
                x_align: Clutter.ActorAlign.CENTER,
                x_expand: true,
            });

            this.add_child(this.label_default_start);
        }
    }
);

export default UIFirstStart;
