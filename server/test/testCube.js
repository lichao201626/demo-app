// x    y    z
// FB  EW   NS

// locate every position of the cube
let POS = {
    // x means from back to front
    x: {
        enum: ['F', 'B', 'NA']
    },
    // y means from west to east
    y: {
        enum: ['E', 'W', 'NA']
    },
    // z means from south to north
    z: {
        enum: ['N', 'S', 'NA']
    },
    // xyz locate one of the 27 nodes
    // and the side determine which side of the node
    side: {
        enum: ['F', 'B', 'E', 'W', 'N', 'S']
    }
}
// x    y    z
// FB  EW   NS
// the seat of a cube
let seats = {
    NORTH: [
        'F-W-N-N', 'F-NA-N-N', 'F-E-N-N',
        'NA-W-N-N', 'NA-NA-N-N', 'NA-E-N-N',
        'B-W-N-N', 'B-NA-N-N', 'B-E-N-N'
    ],
    SOUTH: [
        'F-W-S-S', 'F-NA-S-S', 'F-E-S-S',
        'NA-W-S-S', 'NA-NA-S-S', 'NA-E-S-S',
        'B-W-S-S', 'B-NA-S-S', 'B-E-S-S'
    ],
    EAST: [
        'F-E-N-E', 'NA-E-N-E', 'B-E-N-E',
        'F-E-NA-E', 'NA-E-NA-E', 'B-E-NA-E',
        'F-E-S-E', 'NA-E-S-E', 'B-E-S-E'
    ],
    WEST: [
        'F-W-N-W', 'NA-W-N-W', 'B-W-N-W',
        'F-W-NA-W', 'NA-W-NA-W', 'B-W-NA-W',
        'F-W-S-W', 'NA-W-S-W', 'B-W-S-W'
    ],
    FRONT: [
        'F-W-N-F', 'F-NA-N-F', 'F-E-N-F',
        'F-W-NA-F', 'F-NA-NA-F', 'F-E-NA-F',
        'F-W-S-F', 'F-NA-S-F', 'F-E-S-F'
    ],
    BACK: [
        'B-W-N-B', 'B-NA-N-B', 'B-E-N-B',
        'B-W-NA-B', 'B-NA-NA-B', 'B-E-NA-B',
        'B-W-S-B', 'B-NA-S-B', 'B-E-S-B'
    ]
}

// the data of a cube
let data = {
    F: {
        E: {
            N: {
                N: 'N',
                E: 'E',
                F: 'F'
            },
            NA: {
                E: 'E',
                F: 'F'
            },
            S: {
                S: 'S',
                E: 'E',
                F: 'F'
            }
        },
        NA: {
            N: {
                N: 'N',
                F: 'F'
            },
            NA: {
                F: 'F'
            },
            S: {
                S: 'S',
                F: 'F'
            }
        },
        W: {
            N: {
                N: 'N',
                W: 'W',
                F: 'F'
            },
            NA: {
                W: 'W',
                F: 'F'
            },
            S: {
                S: 'S',
                W: 'W',
                F: 'F'
            }
        }
    },
    NA: {
        E: {
            N: {
                N: 'N',
                E: 'E'
            },
            NA: {
                E: 'E'
            },
            S: {
                S: 'S',
                E: 'E'
            }
        },
        NA: {
            N: {
                N: 'N'
            },
            NA: {},
            S: {
                S: 'S'
            }
        },
        W: {
            N: {
                N: 'N',
                W: 'W'
            },
            NA: {
                W: 'W'
            },
            S: {
                S: 'S',
                W: 'W'
            }
        }
    },
    B: {
        E: {
            N: {
                N: 'N',
                E: 'E',
                B: 'B'
            },
            NA: {
                E: 'E',
                B: 'B'
            },
            S: {
                S: 'S',
                E: 'E',
                B: 'B'
            }
        },
        NA: {
            N: {
                N: 'N',
                B: 'B'
            },
            NA: {
                B: 'B'
            },
            S: {
                S: 'S',
                B: 'B'
            }
        },
        W: {
            N: {
                N: 'N',
                W: 'W',
                B: 'B'
            },
            NA: {
                W: 'W',
                B: 'B'
            },
            S: {
                S: 'S',
                W: 'W',
                B: 'B'
            }
        }
    }
};

//  judge a cube is OK
function isOK(data) {
    // todo
    return true;
}
// distube a cube
function distube() {

}
// move one step
function move() {

}

function test() {

}

function printCube(data) {
    console.log(data);
    // console.log(JSON.stringify(data));
}
/* FEBW
FWBE

F1F2F3
F4F5F6
F7F8F9

FSBN
FNBS

F1F4F7
F2F5F8
F3F6F9 */

printCube(data);
