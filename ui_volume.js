import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';

import {player} from './extension.js';
import {getVolume, setVolume} from './data.js';

const UIVolume = GObject.registerClass(
    {
        GTypeName: 'UIVolume',
    },
    class extends St.BoxLayout {
        _init() {
            super._init({
                style_class: 'gnome-radio-player-box-ui_volume',
                width: 250,
            });

            this.volume_box = new St.BoxLayout({width: 250});

            this._muteIcon();
            this._volumeSlider();

            this.add_child(this.volume_box);
        }

        _muteIcon() {
            this.mute_icon = new St.Icon({
                icon_name: 'audio-volume-medium-symbolic',
                icon_size: 20,
                reactive: true,
                style: 'margin-right:5px',
            });

            this.mute_icon.connect('button-press-event', () => this.setMute());

            this.volume_box.add_child(this.mute_icon);
        }

        _volumeSlider() {
            this.volume_slider = new Slider.Slider(getVolume());
            this.volume_slider.connect(
                'notify::value',
                this.setVolume.bind(this)
            );

            this.volume_box.add_child(this.volume_slider);
        }

        setMute() {
            if (getVolume() > 0) {
                setVolume(0);
                this.volume_slider.value = 0;
            } else {
                this.volume_slider.value = getVolume();
            }
            player.setMute(getVolume() === 0);
            this.setVolIcon(getVolume());
        }

        setVolume(slider, _event) {
            player.setVolume(slider.value);
            setVolume(slider.value);
            this.setVolIcon(slider.value);
        }

        setVolIcon(vol) {
            if (vol === 0)
                this.mute_icon.set_icon_name('audio-volume-muted-symbolic');
            else if (vol < 0.3)
                this.mute_icon.set_icon_name('audio-volume-low-symbolic');
            else if (vol < 0.6)
                this.mute_icon.set_icon_name('audio-volume-medium-symbolic');
            else this.mute_icon.set_icon_name('audio-volume-high-symbolic');
        }
    }
);

export default UIVolume;
