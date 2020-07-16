import React from 'react';

function WelcomeToWooster() {
  return (
    <section className="body-section center-spot" id="letters-and-mask">

      {/* SVG Mask for Horizontal Scanning Animation & O-Finish Animation */}
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 544 46.125">

        <defs>

          <mask id="o-finish-mask">
            <clipPath id="clip-path-b" transform="translate(-420.875 -341.875)">
              <path id="o-boundary" className="cls-1b" d="M798.992,386.315a16.745,16.745,0,0,1-6.669-1.355,17.537,17.537,0,0,1-5.443-3.655,17.218,17.218,0,0,1-3.684-5.44,16.765,16.765,0,0,1-1.354-6.669,16.955,16.955,0,0,1,1.352-6.711,17.152,17.152,0,0,1,3.687-5.46,17.521,17.521,0,0,1,5.442-3.655,17.133,17.133,0,0,1,13.358,0,17.131,17.131,0,0,1,9.077,9.113,16.947,16.947,0,0,1,1.353,6.712,16.765,16.765,0,0,1-1.354,6.669,17.178,17.178,0,0,1-9.075,9.094A16.724,16.724,0,0,1,798.992,386.315Zm0-26.05a8.764,8.764,0,0,0-3.475.693,8.908,8.908,0,0,0-4.762,4.761,8.75,8.75,0,0,0-.694,3.477,8.567,8.567,0,0,0,.691,3.425,9.236,9.236,0,0,0,1.907,2.846,9.08,9.08,0,0,0,2.836,1.925,9.024,9.024,0,0,0,6.991,0,9.3,9.3,0,0,0,2.865-1.935,8.929,8.929,0,0,0,1.892-2.825,8.747,8.747,0,0,0,.681-3.437,8.889,8.889,0,0,0-2.575-6.325,9.09,9.09,0,0,0-2.85-1.913A8.843,8.843,0,0,0,798.992,360.265Z" />
            </clipPath>
            <svg y="3">
              <g className="cls-2b">
                <path id="trace-path" className="cls-3b" d="M799,357c-5.825.3-12.356,4.528-13,11-.534,5.368,3.221,9.887,7,12,4.246,2.374,10.461,2.793,15-1a12.869,12.869,0,0,0,3-16C807.339,356.709,799.424,356.978,799,357Z" transform="translate(-420.875 -341.875)" />
              </g>
            </svg>
          </mask>

          <mask id="horizontal-scan-mask">
            <clipPath id="clip-path" transform="translate(-411 -340)">
              <polyline id="scan-path" className="cls-1" points="412 341 954 341 954 343 412 343 412 345 954 345 954 347 412 347 412 349 954 349 954 351 412 351 412 353 954 353 954 355 412 355 412 357 954 357 954 359 412 359 412 361 954 361 954 363 412 363 412 365 954 365 954 367 412 367 412 369 954 369 954 371 412 371 412 373 954 373 954 375 412 375 412 377 954 377 954 379 412 379 412 381 954 381 954 383 412 383 412 385 954 385" />
            </clipPath>
            <g>
              <g className="cls-2">
                <rect id="bounding-rectangle" className="cls-3" x="10.5" y="1" width="523" height="45" />
              </g>
              <polyline id="scan-path-2" data-name="scan-path" className="cls-1" points="1 1 543 1 543 3 1 3 1 5 543 5 543 7 1 7 1 9 543 9 543 11 1 11 1 13 543 13 543 15 1 15 1 17 543 17 543 19 1 19 1 21 543 21 543 23 1 23 1 25 543 25 543 27 1 27 1 29 543 29 543 31 1 31 1 33 543 33 543 35 1 35 1 37 543 37 543 39 1 39 1 41 543 41 543 43 1 43 1 45 543 45" />
            </g>
          </mask>

        </defs>

        <image href="./assets/welcome-to-wOoster.png" mask="url(#o-finish-mask)" x="0" y="0" />
        <image href="./assets/welcome-to-wXoster.png" mask="url(#horizontal-scan-mask)" x="0" y="0" />
      </svg>

    </section >
  );
}

export default WelcomeToWooster;