#!/bin/zsh

# NOTIFICATION SYSTEM DOCUMENTATION
# ================================
# This script plays system sounds for CI/CD notifications. The AI assistant uses it to:
# 1. Alert when human input is needed
# 2. Signal completion of tasks
# 3. Indicate errors/warnings

# USAGE:
# ./notify.sh [sound] [volume]
#   sound:  Any from the list below (default: Ping)
#   volume: 0-1 (default: 1)

# AVAILABLE SOUNDS:
# Basso    - Low pitch error sound (use for critical failures)
# Blow     - Quick negative sound 
# Bottle   - Light glass ping
# Frog     - Unique attention-grabber
# Funk     - Positive completion sound
# Glass    - Clean success notification  
# Hero     - Triumphant completion
# Morse    - For process-related events
# Ping     - Default neutral notification
# Pop      - Light positive sound
# Purr     - Subtle background notification
# Sosumi   - Urgent alert sound
# Submarine- Deep warning sound
# Tink     - High-pitched attention sound

# STANDARD USAGE PATTERNS:
# [ACTION NEEDED]  -> ./notify.sh Sosumi 0.8
# [COMPLETED]      -> ./notify.sh Glass 0.5  
# [ERROR]          -> ./notify.sh Basso 1
# [WARNING]        -> ./notify.sh Tink 0.6
# [WORKING]        -> ./notify.sh Morse 0.3

SOUND=${1:-Ping}
VOLUME=${2:-1} # Range: 0 (silent) to 1 (full volume)

# Play the specified system sound
afplay -v $VOLUME /System/Library/Sounds/$SOUND.aiff

# Exit codes:
# 0 - Success
# 1 - Invalid sound specified
# 2 - Volume out of range
