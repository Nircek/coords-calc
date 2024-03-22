export const DD_RE = /^([-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)), ([-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))$/;
export const DMS_RE = /^(?:[1-8]?\d°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?|90°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?)?) ?[NS] (?:180°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?)?) ?[EW]$/

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