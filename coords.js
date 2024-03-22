export const DD_RE = /^([-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)), ([-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))$/;
export const DMS_RE = /^(?:[1-8]?\d°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?|90°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?)?) ?[NS] (?:180°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?)?) ?[EW]$/
export const MAIDENHEAD_RE = /^[A-R]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2})?)?)?)?)?)?)?$/;

export function tidy_dd(dd_str) {
    return dd_str
        .replace(/,/g, ", ")
        .replace(/\s{2,}/g, " ")
        .replace(/[^-+0-9,. ]/, "");
}

export function tidy_dms(dms_str) {
    return dms_str
        .replace(/\s{2,}/g, " ")
        .replace(/d/g, "°")
        .replace(/'/g, "′")
        .replace(/′′|"/g, "″")
        .replace(/[^0-9.°′″NESW ]/, "");
}

export function tidy_maidenhead(maidenhead_str) {
    return maidenhead_str.substr(0, 2) + maidenhead_str.substr(2).toLowerCase();
}

export function convert_dd(str) {
    const [_, lat, long] = str.match(DD_RE);
    return [+lat, +long];
}

function convert_dms_str(str) {
    const [deg, min, sec] = [...str.split(/[°′″]/g), 0, 0];
    console.log(deg, min, sec);
    return + deg + min / 60 + sec / 3600;
}

export function convert_dms(str) {
    const [str_lat, str_long] = str.replace(" ", "").split(/[NESW]/g);
    const [sign_lat, sign_long] = [...str.replace(/[^NESW]/g, "")]
        .map((e) => e == "S" || e == "W");

    const [lat, long] = [str_lat, str_long].map(convert_dms_str);
    console.log(lat, long);
    return [(sign_lat ? -1 : 1) * lat, (sign_long ? -1 : 1) * long];
}

const charCode_A = 'A'.charCodeAt(0);
const charCode_a = 'a'.charCodeAt(0);

export function convert_maidenhead(str) {
    let long = -180, lat = -90;
    long += 20 * (str.charCodeAt(0) - charCode_A);
    lat += 10 * (str.charCodeAt(1) - charCode_A);
    let dlong = 20, dlat = 10;
    for (let i = 1; 2 * i < str.length; ++i) {
        if (i % 2 == 1) {
            dlong /= 10; dlat /= 10;
            long += str[2 * i] * dlong;
            lat += str[2 * i + 1] * dlat;
        } else {
            dlong /= 24; dlat /= 24;
            long += (str.charCodeAt(2 * i) - charCode_a) * dlong;
            lat += (str.charCodeAt(2 * i + 1) - charCode_a) * dlat;
        }
    }

    return [lat + dlat / 2, long + dlong / 2];
}

export function generate_dd(lat, long) {
    return `${lat.toFixed(7)}, ${long.toFixed(7)}`;
}

function generate_dms_str(dd, long) {
    const sign = dd < 0;
    if (sign) dd = -dd;
    dd = Math.round(dd * 3600 * 1000 | 0) / 1000;
    const dir = "NESW"[sign * 2 + long];
    return `${dd / 3600 | 0}° ${dd % 3600 / 60 | 0}′ ${(dd % 60).toFixed(3)}″ ${dir}`;
}

export function generate_dms(lat, long) {
    return `${generate_dms_str(lat, false)} ${generate_dms_str(long, true)}`;
}

const maidenhead_alphabet_upper = 'ABCDEFGHIJKLMNOPQRSTUVWX';
const maidenhead_alphabet_lower = maidenhead_alphabet_upper.toLowerCase();

export function generate_maidenhead(lat, long) {

    if (long >= 180) long = -180;

    long += 180; lat += 90;
    let square = [long / 20, lat / 10].map(x => maidenhead_alphabet_upper[x | 0]).join('');
    long = long % 20 / 20; lat = lat % 10 / 10;
    for (let i = 1; i < 5; ++i) {
        console.log(i, long, lat);
        if (i % 2 == 1) {
            square += `${long * 10 | 0}${lat * 10 | 0}`
            long = long * 10 % 1;
            lat = lat * 10 % 1;
        } else {
            square += [long * 24, lat * 24].map(x => maidenhead_alphabet_lower[x | 0]).join('');
            long = long * 24 % 1;
            lat = lat * 24 % 1;
        }
    }
    return square;
}
