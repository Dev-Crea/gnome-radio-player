import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const FILE_NAME = 'configuration.json';
const NAME_APPLICATION = 'gnome-radio-player@dev-crea.com';

function _readConfiguration() {
    const filepath = GLib.build_filenamev([
        GLib.get_user_config_dir(),
        NAME_APPLICATION,
        FILE_NAME,
    ]);
    const file = Gio.File.new_for_path(filepath);
    const [_ok, contents, _etag] = file.load_contents(null);
    const decoder = new TextDecoder('utf-8');

    return JSON.parse(decoder.decode(contents));
}

async function _writeConfiguration(replace) {
    const filepath = GLib.build_filenamev([
        GLib.get_user_config_dir(),
        NAME_APPLICATION,
        FILE_NAME,
    ]);
    const file = Gio.File.new_for_path(filepath);

    try {
        const dataJSON = JSON.stringify(replace);
        file.replace_contents(
            dataJSON,
            null,
            false,
            Gio.FileCreateFlags.REPLACE_DESTINATION,
            null
        );
    } catch (error) {
        console.error(
            'GnomeRadioPlayer: Failed update file configuration ' + error
        );
    }
}

export function getLastChannel() {
    return _readConfiguration().last_channel;
}

export function getVolume() {
    return _readConfiguration().volume;
}

export function setVolume(volume) {
    let new_content = _readConfiguration();
    new_content.volume = volume;

    _writeConfiguration(new_content);
}

function _getChannels() {
    const channels = _readConfiguration().list_channels;

    return channels;
}

export function setFavorite(name) {
    let new_content = _readConfiguration();
    let channels = new_content.list_channels;
    let index = channels.map(ch => ch.name).indexOf(name);
    new_content.list_channels[index].favorite =
        !new_content.list_channels[index].favorite;

    _writeConfiguration(new_content);
}

export function path_asset() {
    let extensionObject = Extension.lookupByUUID(NAME_APPLICATION);

    return extensionObject.metadata.path;
}

export function favorite_channels() {
    const channels = _getChannels().filter(channel => channel.favorite);

    return channels;
}

export function list_channels() {
    return _getChannels();
}

export function load_data() {
    let dataDir = GLib.get_user_config_dir() + '/' + NAME_APPLICATION;

    _create_configuration_file_if_needed(dataDir);
}

function _create_configuration_file_if_needed(dataDir) {
    let dir = Gio.file_new_for_path(dataDir);
    let source_file = Gio.file_new_for_path(path_asset()).get_child(FILE_NAME);
    if (!dir.query_exists(null)) {
        try {
            dir.make_directory_with_parents(null);
            let file = dir.get_child(FILE_NAME);
            source_file.copy(file, Gio.FileCopyFlags.NONE, null, null);
        } catch (error) {
            console.error(
                'GnomeRadioPlayer: Failed to create directory and/or file! ' +
                    error
            );
        }
    } else {
        let file = dir.get_child(FILE_NAME);
        if (!file.query_exists(null)) {
            try {
                source_file.copy(file, Gio.FileCopyFlags.NONE, null, null);
            } catch (error) {
                console.error(
                    'GnomeRadioPlayer: Failed to create file! ' + error
                );
            }
        }
    }
}
