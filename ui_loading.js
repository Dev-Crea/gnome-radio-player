import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as Animation from 'resource:///org/gnome/shell/ui/animation.js';

const UILoading = GObject.registerClass(
    {
        GTypeName: 'UILoading',
    },
    class extends St.BoxLayout {
        static spinner;
        static text;

        _init() {
            super._init({
                vertical: false,
                x_align: Clutter.ActorAlign.CENTER,
                style_class: 'gnome-radio-player-iu_loading',
            });

            UILoading.spinner = new Animation.Spinner(16);
            UILoading.text = new St.Label({text: _('Loading ...')});
            UILoading.text.hide();

            this.add_child(UILoading.spinner);
            this.add_child(UILoading.text);

            UILoading.setLoading(false);
        }

        static setLoading(state) {
            if (!state) {
                this.text.hide();
                this.spinner.stop();
                this.spinner.hide();
            } else {
                this.text.show();
                this.spinner.play();
                this.spinner.show();
            }
        }
    }
);

export default UILoading;
