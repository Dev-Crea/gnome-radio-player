import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import * as Radio from './radio.js';
import {load_data} from './data.js';

import UIGnomeRadioPlayer from './ui_gnome_radio_player.js';

let button;

export let player;

export default class GnomeRadioPlayerExtension extends Extension {
    constructor(metadata) {
        super(metadata);

        this.initTranslations('gnome-radio-player@dev-crea.com');
    }

    enable() {
        this._settings = this.getSettings();

        load_data();

        player = new Radio.RadioPlayer();
        button = new UIGnomeRadioPlayer();
        Main.panel.addToStatusArea('gnome-radio-player', button);
    }

    disable() {
        player.stop();
        button.destroy();
        button = null;
        player = null;
        this._settings = null;
    }
}
