#!/bin/bash

BEGINNING="gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings"

KEY_PATH="/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings"

gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
"['$KEY_PATH/custom0/']"

echo "Installing key shortcut..."

$BEGINNING/custom0/ name "Access WigWag India Door"
$BEGINNING/custom0/ command "/usr/bin/ww-open-door-lock"
$BEGINNING/custom0/ binding "<Shift><Ctrl>G"