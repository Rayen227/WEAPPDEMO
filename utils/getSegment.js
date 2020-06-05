var segment = ["童生", "秀才", "举人", "贡士", "进士"];
function getSeg(level) {
    switch (level) {
        case 0: ;
        case 1: return segment[0];
        case 2: ;
        case 3: ;
        case 4: return segment[1];
        case 5: ;
        case 6: ;
        case 7: return segment[2];
        case 8: ;
        case 9: ;
        case 10: ;
        case 11: return segment[3];
        case 12: return segment[4];
    }
}

module.exports = getSeg;