export class DecimalDegrees {
    static regex = /^([-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)), ([-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))$/;
    static tidy(str) {
        return str
            .replace(/,/g, ", ")
            .replace(/\s{2,}/g, " ")
            .replace(/[^-+0-9,. ]/, "");

    }
    static convert(str) {
        const [_, lat, long] = str.match(DecimalDegrees.regex);
        return [+lat, +long];

    }
    static generate(lat, long) {
        return `${lat.toFixed(7)}, ${long.toFixed(7)}`;
    }
}

export class DegreesMinutesSeconds {
    static regex = /^(?:[1-8]?\d°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?|90°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?)?) ?[NS] (?:180°(?: ?00?′(?: ?00?(?:.00?0?)?″)?)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))°(?: ?\d\d?′(?: ?\d\d?(?:.\d\d?\d?)?″)?)?) ?[EW]$/;
    static tidy(str) {
        return str
            .replace(/d/g, "°")
            .replace(/'/g, "′")
            .replace(/′′|"/g, "″")
            .toUpperCase()
            .replace(/[^0-9.°′″NESW ]/, "")
            .replace(/°/g, "° ")
            .replace(/′/g, "′ ")
            .replace(/″/g, "″ ")
            .replace(/\s{2,}/g, " ");
    }
    static #convert_dms_str(str) {
        const [deg, min, sec] = [...str.split(/[°′″]/g), 0, 0];
        return + deg + min / 60 + sec / 3600;
    }
    static convert(str) {
        const [str_lat, str_long] = str.replace(" ", "").split(/[NESW]/g);
        const [sign_lat, sign_long] = [...str.replace(/[^NESW]/g, "")]
            .map((e) => e == "S" || e == "W");

        const [lat, long] = [str_lat, str_long].map(DegreesMinutesSeconds.#convert_dms_str);
        return [(sign_lat ? -1 : 1) * lat, (sign_long ? -1 : 1) * long];
    }
    static #generate_dms_str(dd, long) {
        const sign = dd < 0;
        if (sign) dd = -dd;
        dd = Math.round(dd * 3600 * 1000 | 0) / 1000;
        const dir = "NESW"[sign * 2 + long];
        return `${dd / 3600 | 0}° ${dd % 3600 / 60 | 0}′ ${(dd % 60).toFixed(3)}″ ${dir}`;
    }
    static generate(lat, long) {
        return `${DegreesMinutesSeconds.#generate_dms_str(lat, false)} ${DegreesMinutesSeconds.#generate_dms_str(long, true)}`;
    }
}

export class Maidenhead {
    static regex = /^[A-Ra-r]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2}([A-Xa-x]{2}([0-9]{2})?)?)?)?)?)?)?$/;
    static #charCode_A = 'A'.charCodeAt(0);
    static #charCode_a = 'a'.charCodeAt(0);
    static #alphabet_upper = 'ABCDEFGHIJKLMNOPQRSTUVWX';
    static #alphabet_lower = Maidenhead.#alphabet_upper.toLowerCase();
    static tidy(str) {
        return str.substr(0, 2).toUpperCase() + str.substr(2).toLowerCase();

    }
    static convert(str) {
        let long = -180, lat = -90;
        long += 20 * (str.charCodeAt(0) - Maidenhead.#charCode_A);
        lat += 10 * (str.charCodeAt(1) - Maidenhead.#charCode_A);
        let dlong = 20, dlat = 10;
        for (let i = 1; 2 * i < str.length; ++i) {
            if (i % 2 == 1) {
                dlong /= 10; dlat /= 10;
                long += str[2 * i] * dlong;
                lat += str[2 * i + 1] * dlat;
            } else {
                dlong /= 24; dlat /= 24;
                long += (str.charCodeAt(2 * i) - Maidenhead.#charCode_a) * dlong;
                lat += (str.charCodeAt(2 * i + 1) - Maidenhead.#charCode_a) * dlat;
            }
        }
        return [lat + dlat / 2, long + dlong / 2];
    }
    static generate(lat, long) {
        if (long >= 180) long = -180;
        long += 180; lat += 90;
        let square = [long / 20, lat / 10].map(x => Maidenhead.#alphabet_upper[x | 0]).join('');
        long = long % 20 / 20; lat = lat % 10 / 10;
        for (let i = 1; i < 5; ++i) {
            if (i % 2 == 1) {
                square += `${long * 10 | 0}${lat * 10 | 0}`
                long = long * 10 % 1;
                lat = lat * 10 % 1;
            } else {
                square += [long * 24, lat * 24].map(x => Maidenhead.#alphabet_lower[x | 0]).join('');
                long = long * 24 % 1;
                lat = lat * 24 % 1;
            }
        }
        return square;
    }
}

export class New {
    static regex = null;
    static tidy(str) { }
    static convert(str) { }
    static generate(lat, long) { }
}
