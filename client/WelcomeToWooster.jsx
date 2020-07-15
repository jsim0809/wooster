import React from 'react';

function WelcomeToWooster() {
  return (
    <section className="body-section center-spot">

      {/* Big SVG mask definition */}
      <svg id="letter-mask" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="4.5 11 523 50">
  <defs>
    <clipPath id="clip-path" transform="translate(-380.549 -319.079)">
      <path id="W" class="cls-1" d="M422.708,377.02a3.97,3.97,0,0,1-3.587-2.453l-4.96-11.5-4.968,11.521a3.879,3.879,0,0,1-1.531,1.817,3.969,3.969,0,0,1-2.132.62c.027,0-.043,0-.113,0a4.017,4.017,0,0,1-2.069-.564,3.865,3.865,0,0,1-1.629-1.925l-15.635-36.27a3.781,3.781,0,0,1,0-3.136,3.974,3.974,0,0,1,2.2-2.095,3.769,3.769,0,0,1,1.494-.305,4.012,4.012,0,0,1,3.661,2.425l12.037,27.932,4.366-10.054-6.366-14.766a3.821,3.821,0,0,1-.036-3.1,3.908,3.908,0,0,1,2.2-2.129,3.783,3.783,0,0,1,1.5-.305,4.044,4.044,0,0,1,1.462.28,3.966,3.966,0,0,1,2.226,2.145l3.348,7.817,3.383-7.805a4.076,4.076,0,0,1,2.138-2.116,3.887,3.887,0,0,1,1.527-.317,4.055,4.055,0,0,1,3.665,2.4,3.792,3.792,0,0,1-.011,3.149L418.512,353l4.321,10.07,12.109-27.909a4.088,4.088,0,0,1,2.11-2.11,3.836,3.836,0,0,1,1.537-.323,4.057,4.057,0,0,1,1.514.3,3.938,3.938,0,0,1,2.168,2.127,3.838,3.838,0,0,1-.041,3.118l-9.633,22.3-6.048,14a3.794,3.794,0,0,1-1.648,1.889,4.052,4.052,0,0,1-2.034.549Q422.788,377.023,422.708,377.02Z"/>
    </clipPath>
    <clipPath id="clip-path-2" transform="translate(-380.549 -319.079)">
      <path id="e" class="cls-1" d="M453.252,377.4a16.588,16.588,0,0,1-6.639-1.346,17.462,17.462,0,0,1-5.385-3.628,17.082,17.082,0,0,1-3.657-5.4,17.085,17.085,0,0,1,0-13.289,17.12,17.12,0,0,1,3.655-5.38,17.471,17.471,0,0,1,5.385-3.629,16.6,16.6,0,0,1,6.639-1.346,16.806,16.806,0,0,1,6.61,1.325,16.989,16.989,0,0,1,9.05,8.958,16.741,16.741,0,0,1,1.4,6.6,3.9,3.9,0,0,1-1.1,2.785,3.836,3.836,0,0,1-2.82,1.157h-21.2a7.848,7.848,0,0,0,.352.727,8.825,8.825,0,0,0,4.572,4.045,8.479,8.479,0,0,0,3.138.584,8.689,8.689,0,0,0,3.718-.772,7.481,7.481,0,0,0,2.676-2.028l.124-.15.15-.124a4.159,4.159,0,0,1,1.974-.948,4.034,4.034,0,0,1,.644-.053,3.987,3.987,0,0,1,1.268.208,3.493,3.493,0,0,1,1.922,1.577,3.922,3.922,0,0,1,.753,2.44,3.8,3.8,0,0,1-1.328,2.767,14.68,14.68,0,0,1-4.9,3.508,16.482,16.482,0,0,1-3.245,1.042A18.03,18.03,0,0,1,453.252,377.4Zm8.477-20.537a8.688,8.688,0,0,0-.406-.9,8.865,8.865,0,0,0-1.953-2.52,9.023,9.023,0,0,0-6.055-2.28,8.7,8.7,0,0,0-3.268.611,9.2,9.2,0,0,0-2.732,1.693,8.753,8.753,0,0,0-1.922,2.515,8.464,8.464,0,0,0-.391.883Z"/>
    </clipPath>
    <clipPath id="clip-path-3" transform="translate(-380.549 -319.079)">
      <path id="l" class="cls-1" d="M474.892,377.021a3.938,3.938,0,0,1-2.8-1.134,3.852,3.852,0,0,1-1.187-2.82V336.653a3.834,3.834,0,0,1,1.208-2.854,4.06,4.06,0,0,1,5.551,0,3.838,3.838,0,0,1,1.209,2.856v36.414a3.853,3.853,0,0,1-1.187,2.82A3.94,3.94,0,0,1,474.892,377.021Z"/>
    </clipPath>
    <clipPath id="clip-path-4" transform="translate(-380.549 -319.079)">
      <path id="c" class="cls-1" d="M496.406,377.367a16.854,16.854,0,0,1-6.589-1.307,16.817,16.817,0,0,1-9.025-8.9,16.376,16.376,0,0,1-1.348-6.595v-.325a16.5,16.5,0,0,1,1.346-6.6,17.1,17.1,0,0,1,9.009-9.009,16.5,16.5,0,0,1,6.607-1.346,17.236,17.236,0,0,1,6.268,1.175,15.087,15.087,0,0,1,5.258,3.379,4.188,4.188,0,0,1,1.31,3,3.884,3.884,0,0,1-1.319,2.948,4.144,4.144,0,0,1-1.806.974,4,4,0,0,1-.851.094,3.734,3.734,0,0,1-.869-.1,4.408,4.408,0,0,1-1.348-.573,9.362,9.362,0,0,1-.84-.6,8.858,8.858,0,0,0-2.883-1.754,9.165,9.165,0,0,0-3.081-.515h-.155a7.991,7.991,0,0,0-3.342.742,9.06,9.06,0,0,0-2.75,1.973,9.386,9.386,0,0,0-1.856,2.874,8.64,8.64,0,0,0-.666,3.342v.22a8.716,8.716,0,0,0,.653,3.334,9,9,0,0,0,4.579,4.811,7.67,7.67,0,0,0,3.352.723h.2a9.621,9.621,0,0,0,3.1-.494,7.954,7.954,0,0,0,2.768-1.67l.088-.075a9.662,9.662,0,0,1,.841-.6,4.4,4.4,0,0,1,1.347-.572,3.713,3.713,0,0,1,.871-.1,3.889,3.889,0,0,1,2.651,1.038,3.852,3.852,0,0,1,1.321,2.946,4.186,4.186,0,0,1-1.309,3,15.112,15.112,0,0,1-5.259,3.38A17.251,17.251,0,0,1,496.406,377.367Z"/>
    </clipPath>
    <clipPath id="clip-path-5" transform="translate(-380.549 -319.079)">
      <path id="o" class="cls-1" d="M525.04,377.4a16.616,16.616,0,0,1-6.619-1.344,17.412,17.412,0,0,1-5.405-3.63,17.082,17.082,0,0,1-3.657-5.4,16.616,16.616,0,0,1-1.344-6.619,16.811,16.811,0,0,1,1.342-6.662,17.076,17.076,0,0,1,3.659-5.42,17.412,17.412,0,0,1,5.405-3.63,17.008,17.008,0,0,1,13.258,0,17.012,17.012,0,0,1,9.012,9.048,16.8,16.8,0,0,1,1.343,6.662,16.6,16.6,0,0,1-1.345,6.619,17.05,17.05,0,0,1-9.01,9.029A16.588,16.588,0,0,1,525.04,377.4Zm0-26.05a8.868,8.868,0,0,0-3.525.7,9.01,9.01,0,0,0-4.827,4.826,8.869,8.869,0,0,0-.7,3.526,8.553,8.553,0,0,0,.7,3.473,9.367,9.367,0,0,0,1.933,2.886,9.2,9.2,0,0,0,2.876,1.952,9.148,9.148,0,0,0,7.091,0,9.4,9.4,0,0,0,2.9-1.96,9.011,9.011,0,0,0,1.92-2.864,8.854,8.854,0,0,0,.692-3.487,9.005,9.005,0,0,0-2.612-6.413,9.19,9.19,0,0,0-2.888-1.939A8.95,8.95,0,0,0,525.04,351.348Z"/>
    </clipPath>
    <clipPath id="clip-path-6" transform="translate(-380.549 -319.079)">
      <path id="m" class="cls-1" d="M581.582,377.021a3.992,3.992,0,0,1-2.794-1.116,3.859,3.859,0,0,1-1.222-2.869V355.68a4.107,4.107,0,0,0-.346-1.706,4.363,4.363,0,0,0-.964-1.391,4.585,4.585,0,0,0-3.179-1.267,4.668,4.668,0,0,0-1.863.376,5.967,5.967,0,0,0-1.693,1.076,4.871,4.871,0,0,0-1.124,1.482,3.575,3.575,0,0,0-.376,1.619v17.167a3.948,3.948,0,0,1-1.117,2.811,3.824,3.824,0,0,1-2.8,1.174,3.99,3.99,0,0,1-2.794-1.116,3.86,3.86,0,0,1-1.223-2.869V355.617a4.576,4.576,0,0,0-.4-1.718,4.423,4.423,0,0,0-.956-1.363,4.353,4.353,0,0,0-1.389-.9,4.42,4.42,0,0,0-1.712-.323,4.844,4.844,0,0,0-1.883.369,5.44,5.44,0,0,0-1.645,1.041,4.985,4.985,0,0,0-1.12,1.491,3.582,3.582,0,0,0-.376,1.62V373a3.946,3.946,0,0,1-1.169,2.848,3.985,3.985,0,0,1-6.8-2.848V347.332a3.879,3.879,0,0,1,1.2-2.835,3.956,3.956,0,0,1,2.812-1.149,3.849,3.849,0,0,1,2.819,1.187,4.017,4.017,0,0,1,.481.595q.459-.3.945-.564a10.333,10.333,0,0,1,4.985-1.25,11.679,11.679,0,0,1,5.856,1.49,11.965,11.965,0,0,1,2.62,2.009,14.243,14.243,0,0,1,3.052-2.057,13.272,13.272,0,0,1,6.017-1.442,11.8,11.8,0,0,1,8.558,3.588,12.524,12.524,0,0,1,2.513,3.837,12.874,12.874,0,0,1,1,4.477,3.327,3.327,0,0,1,.039.525v17.293a3.92,3.92,0,0,1-1.153,2.832A3.879,3.879,0,0,1,581.582,377.021Z"/>
    </clipPath>
    <clipPath id="clip-path-7" transform="translate(-380.549 -319.079)">
      <path id="e-2" data-name="e" class="cls-1" d="M602.718,377.4a16.583,16.583,0,0,1-6.638-1.346,17.467,17.467,0,0,1-5.386-3.628,17.052,17.052,0,0,1-3.656-5.4,17.079,17.079,0,0,1,0-13.289,17.153,17.153,0,0,1,3.655-5.38,17.464,17.464,0,0,1,5.386-3.629,16.594,16.594,0,0,1,6.638-1.346,16.806,16.806,0,0,1,6.61,1.325,17.164,17.164,0,0,1,5.4,3.6,17.339,17.339,0,0,1,3.651,5.356,16.724,16.724,0,0,1,1.4,6.6,3.9,3.9,0,0,1-1.1,2.785,3.836,3.836,0,0,1-2.82,1.157h-21.2a7.839,7.839,0,0,0,.351.727,8.832,8.832,0,0,0,4.573,4.045,8.47,8.47,0,0,0,3.137.584,8.689,8.689,0,0,0,3.718-.772,7.464,7.464,0,0,0,2.676-2.028l.124-.15.15-.124a4.168,4.168,0,0,1,1.974-.948,4.053,4.053,0,0,1,.644-.053,3.987,3.987,0,0,1,1.268.208,3.49,3.49,0,0,1,1.922,1.577,3.923,3.923,0,0,1,.754,2.44,3.8,3.8,0,0,1-1.329,2.767,14.653,14.653,0,0,1-4.9,3.508,16.472,16.472,0,0,1-3.244,1.042A18.047,18.047,0,0,1,602.718,377.4Zm8.477-20.537a8.688,8.688,0,0,0-.406-.9,8.865,8.865,0,0,0-1.953-2.52,9.023,9.023,0,0,0-6.055-2.28,8.7,8.7,0,0,0-3.268.611,9.217,9.217,0,0,0-2.732,1.693,8.771,8.771,0,0,0-1.922,2.515,8.457,8.457,0,0,0-.39.883Z"/>
    </clipPath>
    <clipPath id="clip-path-8" transform="translate(-380.549 -319.079)">
      <path id="t" class="cls-1" d="M641.3,377.021a3.935,3.935,0,0,1-3.953-3.954V351.348h-1.465a3.99,3.99,0,0,1-3.985-4.016,3.85,3.85,0,0,1,1.188-2.819,3.934,3.934,0,0,1,2.8-1.134h1.465v-6.726a3.862,3.862,0,0,1,1.172-2.835A3.912,3.912,0,0,1,641.3,332.7a3.972,3.972,0,0,1,2.774,1.1,3.836,3.836,0,0,1,1.21,2.856v6.726h2.19a3.937,3.937,0,0,1,3.984,3.953,3.955,3.955,0,0,1-1.153,2.863,3.912,3.912,0,0,1-2.831,1.153h-2.19v21.719a3.857,3.857,0,0,1-1.187,2.82A3.942,3.942,0,0,1,641.3,377.021Z"/>
    </clipPath>
    <clipPath id="clip-path-9" transform="translate(-380.549 -319.079)">
      <path id="o-2" data-name="o" class="cls-1" d="M666.1,377.4a16.616,16.616,0,0,1-6.619-1.344,17.412,17.412,0,0,1-5.4-3.63,17.066,17.066,0,0,1-3.657-5.4,16.6,16.6,0,0,1-1.345-6.619,16.812,16.812,0,0,1,1.343-6.662,17.043,17.043,0,0,1,3.659-5.42,17.412,17.412,0,0,1,5.4-3.63,17.006,17.006,0,0,1,13.257,0,17.009,17.009,0,0,1,9.013,9.048,16.812,16.812,0,0,1,1.343,6.662,16.6,16.6,0,0,1-1.345,6.619,17.047,17.047,0,0,1-9.011,9.029A16.583,16.583,0,0,1,666.1,377.4Zm0-26.05a8.869,8.869,0,0,0-3.526.7,9.012,9.012,0,0,0-4.826,4.826,8.852,8.852,0,0,0-.7,3.526,8.553,8.553,0,0,0,.7,3.473,9.35,9.35,0,0,0,1.933,2.886,9.2,9.2,0,0,0,2.876,1.952,9.148,9.148,0,0,0,7.091,0,9.4,9.4,0,0,0,2.9-1.96,9.011,9.011,0,0,0,1.92-2.864,8.854,8.854,0,0,0,.691-3.487,9,9,0,0,0-2.611-6.413,9.2,9.2,0,0,0-2.888-1.939A8.954,8.954,0,0,0,666.1,351.348Z"/>
    </clipPath>
    <clipPath id="clip-path-10" transform="translate(-380.549 -319.079)">
      <path id="W-2" data-name="W" class="cls-1" d="M732.381,377.02a3.973,3.973,0,0,1-3.588-2.453l-4.96-11.5-4.967,11.521a3.882,3.882,0,0,1-1.534,1.817,3.959,3.959,0,0,1-2.13.62c.027,0-.043,0-.112,0a4.023,4.023,0,0,1-2.069-.563,3.863,3.863,0,0,1-1.629-1.926l-15.635-36.27a3.784,3.784,0,0,1,0-3.136,3.979,3.979,0,0,1,2.2-2.095,3.782,3.782,0,0,1,1.5-.305,4.013,4.013,0,0,1,3.66,2.422l12.039,27.934,4.366-10.053-6.367-14.766a3.829,3.829,0,0,1-.036-3.1,3.9,3.9,0,0,1,2.2-2.13,3.784,3.784,0,0,1,1.5-.3,4.044,4.044,0,0,1,1.462.28,3.969,3.969,0,0,1,2.226,2.145l3.347,7.817,3.383-7.805a4.083,4.083,0,0,1,2.138-2.116,3.888,3.888,0,0,1,1.528-.317,4.056,4.056,0,0,1,3.664,2.4,3.792,3.792,0,0,1-.01,3.149L728.185,353l4.32,10.07,12.11-27.909a4.083,4.083,0,0,1,2.109-2.11,3.84,3.84,0,0,1,1.537-.323,4.072,4.072,0,0,1,1.514.3,3.937,3.937,0,0,1,2.168,2.13,3.834,3.834,0,0,1-.041,3.118l-15.68,36.305a3.808,3.808,0,0,1-1.649,1.889,4.047,4.047,0,0,1-2.034.549C732.486,377.023,732.434,377.022,732.381,377.02Z"/>
    </clipPath>
    <clipPath id="clip-path-11" transform="translate(-380.549 -319.079)">
      <path id="o-3" data-name="o" class="cls-1" d="M762.925,377.4a16.623,16.623,0,0,1-6.619-1.344,17.434,17.434,0,0,1-5.406-3.63,17.074,17.074,0,0,1-3.656-5.4A16.61,16.61,0,0,1,745.9,360.4a16.813,16.813,0,0,1,1.344-6.662,17.019,17.019,0,0,1,3.658-5.42,17.418,17.418,0,0,1,5.405-3.63,17.006,17.006,0,0,1,13.257,0,17.018,17.018,0,0,1,9.013,9.048,16.812,16.812,0,0,1,1.343,6.662,16.6,16.6,0,0,1-1.345,6.62,17.061,17.061,0,0,1-9.01,9.028A16.574,16.574,0,0,1,762.925,377.4Zm0-26.05a8.873,8.873,0,0,0-3.526.7,9.027,9.027,0,0,0-4.827,4.826,8.884,8.884,0,0,0-.7,3.526,8.68,8.68,0,0,0,.7,3.474,9.339,9.339,0,0,0,1.933,2.885,9.194,9.194,0,0,0,2.876,1.951,8.655,8.655,0,0,0,3.546.716,8.785,8.785,0,0,0,3.545-.715,9.41,9.41,0,0,0,2.9-1.96,9.01,9.01,0,0,0,1.92-2.865,8.838,8.838,0,0,0,.691-3.486,9,9,0,0,0-2.612-6.413,9.179,9.179,0,0,0-2.888-1.939A8.942,8.942,0,0,0,762.925,351.348Z"/>
    </clipPath>
    <clipPath id="clip-path-12" transform="translate(-380.549 -319.079)">
      <path id="o-4" data-name="o" class="cls-1" d="M795.747,377.4a16.623,16.623,0,0,1-6.619-1.344,17.418,17.418,0,0,1-5.405-3.63,17.077,17.077,0,0,1-3.657-5.4,16.609,16.609,0,0,1-1.344-6.619,16.812,16.812,0,0,1,1.343-6.662,17.022,17.022,0,0,1,3.659-5.42,17.4,17.4,0,0,1,5.4-3.63,17.008,17.008,0,0,1,13.258,0,17.012,17.012,0,0,1,9.012,9.048,16.812,16.812,0,0,1,1.343,6.662,16.6,16.6,0,0,1-1.345,6.62,17.055,17.055,0,0,1-9.009,9.028A16.583,16.583,0,0,1,795.747,377.4Zm0-26.05a8.868,8.868,0,0,0-3.525.7,9.019,9.019,0,0,0-4.827,4.826,8.884,8.884,0,0,0-.7,3.526,8.68,8.68,0,0,0,.7,3.474,9.336,9.336,0,0,0,1.932,2.885,9.206,9.206,0,0,0,2.876,1.951,8.655,8.655,0,0,0,3.546.716,8.782,8.782,0,0,0,3.545-.715,9.41,9.41,0,0,0,2.9-1.96,9.01,9.01,0,0,0,1.92-2.865,8.839,8.839,0,0,0,.692-3.486,9.005,9.005,0,0,0-2.613-6.413,9.186,9.186,0,0,0-2.887-1.939A8.95,8.95,0,0,0,795.747,351.348Z"/>
    </clipPath>
    <clipPath id="clip-path-13" transform="translate(-380.549 -319.079)">
      <path id="s" class="cls-1" d="M824.191,377.367a17.794,17.794,0,0,1-3.549-.355,14.907,14.907,0,0,1-3.368-1.112,12.415,12.415,0,0,1-2.945-1.933,9.541,9.541,0,0,1-2.227-2.9,3.874,3.874,0,0,1-.4-3.009,3.65,3.65,0,0,1,1.722-2.223,3.857,3.857,0,0,1,1.929-.5,4.594,4.594,0,0,1,.734.06,4.232,4.232,0,0,1,2.641,1.637l.086.11.072.12a4.881,4.881,0,0,0,2,1.96,7.36,7.36,0,0,0,3.3.652,6.2,6.2,0,0,0,1.8-.262,5.135,5.135,0,0,0,1.477-.7,2.9,2.9,0,0,0,.856-.919,1.9,1.9,0,0,0,.262-1,1.522,1.522,0,0,0-.235-.9,3.454,3.454,0,0,0-1.036-.927,10.042,10.042,0,0,0-1.941-.9c-.822-.287-1.691-.553-2.58-.79l-.107-.032c-1.2-.392-2.38-.828-3.513-1.3a14.979,14.979,0,0,1-3.347-1.9,9.825,9.825,0,0,1-2.546-2.866,8.084,8.084,0,0,1-1.044-4.127,8.779,8.779,0,0,1,1.113-4.406,9.761,9.761,0,0,1,2.786-3.12,12.247,12.247,0,0,1,3.742-1.811,14.61,14.61,0,0,1,4.124-.6,15.767,15.767,0,0,1,3.085.307,13.257,13.257,0,0,1,2.947.947,11.08,11.08,0,0,1,2.57,1.632,8.172,8.172,0,0,1,2,2.515,3.82,3.82,0,0,1,.409,2.425,3.615,3.615,0,0,1-.992,1.918,3.733,3.733,0,0,1-1.9,1.073,3.648,3.648,0,0,1-.808.092,3.52,3.52,0,0,1-1.589-.38l-.349-.175-.258-.294a9.543,9.543,0,0,0-2.32-1.983,4.96,4.96,0,0,0-2.509-.58,8.261,8.261,0,0,0-1.763.19,4.449,4.449,0,0,0-1.35.517,2.283,2.283,0,0,0-.758.719,1.7,1.7,0,0,0-.208.921,1.514,1.514,0,0,0,.177.8,2.672,2.672,0,0,0,.779.775,7.37,7.37,0,0,0,1.551.79c.693.264,1.448.518,2.243.757,1.385.433,2.707.885,3.951,1.349a16.2,16.2,0,0,1,3.65,1.893,9.69,9.69,0,0,1,2.769,2.955,8.357,8.357,0,0,1,1.1,4.35,9.287,9.287,0,0,1-1.027,4.3,10.635,10.635,0,0,1-2.689,3.332,12.391,12.391,0,0,1-3.865,2.146A14.171,14.171,0,0,1,824.191,377.367Z"/>
    </clipPath>
    <clipPath id="clip-path-14" transform="translate(-380.549 -319.079)">
      <path id="t-2" data-name="t" class="cls-1" d="M843.847,377.021a3.937,3.937,0,0,1-3.953-3.954V351.348h-1.465a3.99,3.99,0,0,1-3.985-4.016,3.846,3.846,0,0,1,1.19-2.821,3.929,3.929,0,0,1,2.795-1.132h1.465v-6.726a3.863,3.863,0,0,1,1.172-2.835,3.913,3.913,0,0,1,2.781-1.117,3.967,3.967,0,0,1,2.774,1.1,3.832,3.832,0,0,1,1.21,2.855v6.726h2.19a3.935,3.935,0,0,1,3.984,3.953,3.959,3.959,0,0,1-1.151,2.862,3.915,3.915,0,0,1-2.833,1.154h-2.19v21.719a3.855,3.855,0,0,1-1.188,2.821A3.94,3.94,0,0,1,843.847,377.021Z"/>
    </clipPath>
    <clipPath id="clip-path-15" transform="translate(-380.549 -319.079)">
      <path id="e-3" data-name="e" class="cls-1" d="M868.636,377.4A16.584,16.584,0,0,1,862,376.052a17.449,17.449,0,0,1-5.386-3.628,17.074,17.074,0,0,1-3.656-5.4,17.073,17.073,0,0,1,0-13.289,17.115,17.115,0,0,1,3.655-5.38A17.423,17.423,0,0,1,862,344.725a16.583,16.583,0,0,1,6.638-1.346,16.794,16.794,0,0,1,6.609,1.325,17,17,0,0,1,9.051,8.958,16.746,16.746,0,0,1,1.4,6.6,3.9,3.9,0,0,1-1.1,2.786,3.839,3.839,0,0,1-2.82,1.156h-21.2a7.99,7.99,0,0,0,.352.728,8.839,8.839,0,0,0,4.572,4.044,8.479,8.479,0,0,0,3.138.584,8.689,8.689,0,0,0,3.718-.772,7.481,7.481,0,0,0,2.676-2.029l.123-.149.15-.123a4.169,4.169,0,0,1,1.975-.949,4.034,4.034,0,0,1,.644-.053,3.992,3.992,0,0,1,1.268.208,3.491,3.491,0,0,1,1.922,1.578,3.919,3.919,0,0,1,.753,2.441,3.791,3.791,0,0,1-1.329,2.765,14.616,14.616,0,0,1-4.9,3.508,16.461,16.461,0,0,1-3.245,1.042A18.021,18.021,0,0,1,868.636,377.4Zm8.476-20.537a8.482,8.482,0,0,0-.406-.9,8.844,8.844,0,0,0-1.952-2.52,9.028,9.028,0,0,0-6.055-2.28,8.7,8.7,0,0,0-3.268.611,9.171,9.171,0,0,0-2.732,1.693,8.77,8.77,0,0,0-1.923,2.515,8.457,8.457,0,0,0-.39.883Z"/>
    </clipPath>
    <clipPath id="clip-path-16" transform="translate(-380.549 -319.079)">
      <path id="r" class="cls-1" d="M890.276,377.021a3.964,3.964,0,0,1-2.812-1.149,3.92,3.92,0,0,1-1.2-2.868V347.332a3.877,3.877,0,0,1,1.2-2.833,3.965,3.965,0,0,1,2.814-1.151,3.835,3.835,0,0,1,2.855,1.208,3.968,3.968,0,0,1,.976,1.766,18.211,18.211,0,0,1,2.4-1.364,16.933,16.933,0,0,1,7.312-1.61h.252a4,4,0,0,1,2.978,1.156,3.931,3.931,0,0,1,1.1,2.8,3.842,3.842,0,0,1-1.243,2.9,4.11,4.11,0,0,1-2.836,1.08h-.22a9.232,9.232,0,0,0-3.709.749,9.692,9.692,0,0,0-3.06,2.076,10.155,10.155,0,0,0-2.091,3.121,9.5,9.5,0,0,0-.764,3.8V373a3.971,3.971,0,0,1-1.133,2.828A3.848,3.848,0,0,1,890.276,377.021Z"/>
    </clipPath>
  </defs>
  <title>letters</title>
  <g id="W-grp">
    <g class="cls-2">
      <polyline id="W-path-1" class="cls-3" points="5.451 11.921 28.451 61.921 21.451 61.921 44.451 10.921"/>
      <polyline id="W-path-2" class="cls-3" points="61.451 10.921 38.451 61.921 45.451 61.921 23.451 10.921"/>
    </g>
  </g>
  <g id="e-grp">
    <g class="cls-4">
      <path id="e-path" class="cls-3" d="M435,360h38c-1.744,3.418-10.754-9.563-19-13-9.231-3.847-14,12-14,12s3,14,8,14,7,2,13-3,8-6,8-6" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="l-grp">
    <g class="cls-5">
      <line id="l-path" class="cls-3" x1="94.451" y1="7.921" x2="94.451" y2="63.921"/>
    </g>
  </g>
  <g id="c-grp">
    <g class="cls-6">
      <path id="c-path" class="cls-3" d="M512,355s-7-9-16-8a13.34,13.34,0,0,0-12,12c0,3,1,12,7,14s12-1,12-1l10-7" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="o-grp">
    <g class="cls-7">
      <path id="o-path" class="cls-3" d="M527,348s-10-4-14,9,8,16,8,16,13,3,16-7-5-16-5-16-7-4-13-3" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="m-grp">
    <g class="cls-8">
      <path id="m-path-1" class="cls-3" d="M564,380V351s-7-7-17-1,0-10,0-10v40" transform="translate(-380.549 -319.079)"/>
      <path id="m-path-2" class="cls-3" d="M562,380V353s11-8,14-5,6,3,5,7,0,25,0,25" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="e-grp-2" data-name="e-grp">
    <g class="cls-9">
      <path id="e-path-2" data-name="e-path" class="cls-3" d="M583,360h40a32.953,32.953,0,0,1-8-5c-3.8-3.411-6.738-8-12-8-10,0-13,15-13,15s5,12,11,11,7,0,7,0l12-9" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="t-grp">
    <g class="cls-10">
      <polyline id="t-path" class="cls-3" points="261.451 7.921 261.451 62.921 249.451 27.921 273.451 27.921"/>
    </g>
  </g>
  <g id="o-grp-2" data-name="o-grp">
    <g class="cls-11">
      <path id="o-path-2" data-name="o-path" class="cls-3" d="M670,347s-17,0-16,12,8,14,9,14,11-1,14-6,0-16-1-16-8-6-15-5" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="W-grp-2" data-name="W-grp">
    <g class="cls-12">
      <polyline id="W-path-1-2" data-name="W-path-1" class="cls-3" points="313.451 7.921 338.451 61.921 330.451 61.921 354.451 7.921"/>
      <polyline id="W-path-2-2" data-name="W-path-2" class="cls-3" points="372.451 7.921 348.451 61.921 356.451 61.921 331.451 7.921"/>
    </g>
  </g>
  <g id="o-grp-3" data-name="o-grp">
    <g class="cls-13">
      <path id="o-path-3" data-name="o-path" class="cls-3" d="M766,348s-13-3-17,10,14,16,14,16,11-3,14-10-7-14-7-14-7-5-13-2" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="o-grp-4" data-name="o-grp">
    <g class="cls-14">
      <path id="o-path-4" data-name="o-path" class="cls-3" d="M798,347s-13-2-15,14,18,11,18,11,11-5,8-15-17-10-17-10" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="s-grp">
    <g class="cls-15">
      <path id="s-path" class="cls-3" d="M836,354s-4-9-13-6-6,7-6,7,9,7,14,9-3,9-3,9-9,1-9,0-9-10-9-10" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="t-grp-2" data-name="t-grp">
    <g class="cls-16">
      <polyline id="t-path-2" data-name="t-path" class="cls-3" points="463.451 7.921 463.451 61.921 450.451 27.921 477.71 27.841"/>
    </g>
  </g>
  <g id="e-grp-3" data-name="e-grp">
    <g class="cls-17">
      <path id="e-path-3" data-name="e-path" class="cls-3" d="M850,361l39-1-8-2s-2-13-12-10-11,4-11,6-6,10,0,15,11,4,11,4,10-2,15-8" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
  <g id="r-grp">
    <g class="cls-18">
      <path id="r-path" class="cls-3" d="M890,338v45l2-31s19-9,21-6" transform="translate(-380.549 -319.079)"/>
    </g>
  </g>
        <image id="letters" href="./assets/welcome-to-wooster.png" mask="url(#letter-animation-mask)" x="4.5" y="11" />
</svg>



        {/* <rect x="0" y="0" width="600" height="60" style={{ stroke: 'none', fill: '#0000ff', mask: 'url(#letter-animation-mask)' }} /> */}
      <div id="wipe-animation"></div>
    </section >
  );
}

export default WelcomeToWooster;