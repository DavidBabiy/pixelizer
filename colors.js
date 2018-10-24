const ansiColorsMap = {
    // 97: 'BRIGHT_WHITE',
    96: 'BRIGHT_CYAN',
    95: 'BRIGHT_MAGENTA',
    94: 'BRIGHT_BLUE',
    93: 'BRIGHT_YELLOW',
    92: 'BRIGHT_GREEN',
    91: 'BRIGHT_RED',
    // 90: 'BRIGHT_BLACK',
    // 37: 'WHITE',
    36: 'CYAN',
    35: 'MAGENTA',
    34: 'BLUE',
    33: 'YELLOW',
    32: 'GREEN',
    31: 'RED',
    // 30: 'BLACK',

    // TODO: tmp fix, bugfix for Spring ansi colors
    90: 'BRIGHT_WHITE',
    30: 'BRIGHT_BLACK',
    37: 'WHITE',
    97: 'BLACK'
};

module.exports = { ansiColorsMap: ansiColorsMap };
