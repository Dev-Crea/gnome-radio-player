import Gst from 'gi://Gst';

import UIPopup from './ui_popup.js';
import UIPlayerInfo from './ui_player_info.js';
import UIPlayerControl from './ui_player_control.js';
import UILoading from './ui_loading.js';

import {getVolume} from './data.js';

export let currentChannel = {name: '', favorite: false};

export const RadioPlayer = class RadioPlayer {
    constructor() {
        Gst.init(null);
        this.playbin = Gst.ElementFactory.make('playbin', 'somafm');
        this.sink = Gst.ElementFactory.make('pulsesink', 'sink');
        this.sink.set_property('client-name', 'gnome-radio-player');
        this.playbin.set_property('audio-sink', this.sink);
        this.playbin.volume = getVolume();

        let bus = this.playbin.get_bus();
        bus.add_signal_watch();
        bus.connect('message', (_bus, msg) => {
            if (msg !== null) this._onMessageReceived(msg);
        });
        this.onError = null;
    }

    play() {
        this.playbin.set_state(Gst.State.PLAYING);
        this.playing = true;
        UILoading.setLoading(true);
    }

    setOnError(onError) {
        this.onError = onError;
    }

    setMute(mute) {
        this.playbin.set_property('mute', mute);
    }

    setVolume(value) {
        this.playbin.volume = value;
    }

    stop() {
        this.playbin.set_state(Gst.State.NULL);
        this.playing = false;

        UIPopup.update_stop();
        UIPlayerInfo.update_stop();
        UIPlayerControl.update_stop();
    }

    start() {
        UILoading.setLoading(false);
        UIPopup.update_play();
        UIPlayerInfo.update_play();
        UIPlayerControl.update_play();
    }

    setChannel(channel) {
        currentChannel = channel;
        this.stop();
        this.playbin.set_property('uri', channel.link);
        this.play();
    }

    _onMessageReceived(msg) {
        switch (msg.type) {
            case Gst.MessageType.UNKNOWN:
            case Gst.MessageType.EOS:
            case Gst.MessageType.ERROR:
            case Gst.MessageType.WARNING:
            case Gst.MessageType.INFO:
                console.log(
                    'GRP : [' + msg.type + '] Error ... ' + msg.message
                );
                this.stop();
                break;
            case Gst.MessageType.STREAM_START:
                this.start();
                break;
            default:
                break;
        }
    }
};
