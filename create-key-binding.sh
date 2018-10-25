#!/bin/bash

BEGINNING="gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings"

KEY_PATH="/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings"

gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
"['$KEY_PATH/custom0/']"

echo "Installing key shortcut..."
# Take a screenshot of the entire display
$BEGINNING/custom0/ name "Access WigWag India Door"
$BEGINNING/custom0/ command "/usr/bin/open-ww-door-lock"
$BEGINNING/custom0/ binding "<Shift><Ctrl>G"