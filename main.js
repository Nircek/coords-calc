import {
    DD_RE,
    DMS_RE,
    MAIDENHEAD_RE,
    tidy_dd,
    tidy_dms,
    tidy_maidenhead,
    convert_dd,
    convert_dms,
    convert_maidenhead,
    generate_dd,
    generate_dms,
    generate_maidenhead
} from "./coords.js";

var lat, long, last;

function updateValue(el, value) {
    if (el == last) return;
    el.value = value;
}

function updateAll() {
    updateValue(document.querySelector('#dd'), generate_dd(lat, long));
    updateValue(document.querySelector('#dms'), generate_dms(lat, long));
    updateValue(document.querySelector('#maidenhead'), generate_maidenhead(lat, long));
}

function addInput(id, tidy, re, convert) {
    document.querySelector(id).addEventListener('change', (ev) => {
        ev.target.value = tidy(ev.target.value);
    });

    document.querySelector(id).addEventListener('input', (ev) => {
        const value = tidy(ev.target.value);
        const valid = re.test(value);
        if (!valid) { ev.target.classList.add("invalid"); return; }
        ev.target.classList.remove("invalid");

        [lat, long] = convert(value);
        last = ev.target;
        updateAll();
    });
}

addInput('#dd', tidy_dd, DD_RE, convert_dd);
addInput('#dms', tidy_dms, DMS_RE, convert_dms);
addInput('#maidenhead', tidy_maidenhead, MAIDENHEAD_RE, convert_maidenhead);
