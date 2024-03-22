import {
    DD_RE,
    DMS_RE,
    tidy_dd,
    tidy_dms,
    convert_dd,
    convert_dms,
    generate_dd,
    generate_dms
} from "./coords.js";

var lat, long, last;

function updateValue(el, value) {
    if (el == last) return;
    el.value = value;
}

function updateAll() {
    updateValue(document.querySelector('#dd'), generate_dd(lat, long));
    updateValue(document.querySelector('#dms'), generate_dms(lat, long));
}

document.querySelector('#dd').addEventListener('change', (ev) => {
    ev.target.value = tidy_dd(ev.target.value);
});

document.querySelector('#dd').addEventListener('input', (ev) => {
    const value = tidy_dd(ev.target.value);
    const valid = DD_RE.test(value);
    if (!valid) { ev.target.classList.add("invalid"); return; }
    ev.target.classList.remove("invalid");

    [lat, long] = convert_dd(value);
    last = ev.target;
    updateAll();
});

document.querySelector('#dms').addEventListener('change', (ev) => {
    ev.target.value = tidy_dms(ev.target.value);
});

document.querySelector('#dms').addEventListener('input', (ev) => {
    const value = tidy_dms(ev.target.value);
    const valid = DMS_RE.test(value);
    if (!valid) { ev.target.classList.add("invalid"); return; }
    ev.target.classList.remove("invalid");

    [lat, long] = convert_dms(value);
    last = ev.target;
    updateAll();
});