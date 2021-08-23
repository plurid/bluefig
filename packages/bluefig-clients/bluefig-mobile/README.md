<p align="center">
    <a target="_blank" href="https://plurid.com/bluefig">
        <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/identity/bluefig-logo.png" height="250px">
    </a>
    <br />
    <br />
    <a target="_blank" href="https://github.com/plurid/bluefig/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=1380C3&style=for-the-badge" alt="License: DEL">
    </a>
</p>



<h1 align="center">
    bluefig
</h1>


<h3 align="center">
    Device Configuration over Bluetooth
</h3>



<br />



`bluefig` is intended for the configuration of devices without input/output mechanisms.

A `bluefig-server` runs on the device and the user connects to it through the `bluefig-client`, running on a common user terminal.



### Contents

+ [Usage](#usage)
    + [Example](#example)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## Usage

The `bluefig-server` will load at start a list of `views` and `hooks` which will determine the `bluefig-client` user interface and the `bluefig-server` behavior.

A `bluefig-view` is comprised of `elements` and `actions`.

The `elements` will be sent by the `bluefig-server` to be rendered by the `bluefig-client`.

The `element types` are

+ `text`
+ `input-text`
+ `input-select`
+ `input-switch`
+ `button`
+ `image`
+ `list`

The `elements` used for input (`input-text`, `input-select`, `input-switch`, `button`) can have an `action` field. When the user interacts with the `element` on the `bluefig-client`, the established `action` will run accordingly on the `bluefig-server`.


### Example

Considering the simple view

``` typescript
import {
    ViewsServer,
} from '@plurid/bluefig-server';


const views: ViewsServer = {
    '/': {
        title: 'Index',
        elements: [
            {
                type: 'text',
                value: 'Index View',
            },
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputText',
            },
            {
                type: 'button',
                title: 'Click Me',
                action: 'click',
            },
        ],
        actions: {
            'click': {
                arguments: [
                    'inputText',
                ],
                execution: async (
                    inputText,
                ) => {
                    console.log('Click action called', inputText);
                },
            },
        },
    },
};
```

the `bluefig-client` will then render an interface with a text input field which will listen for changes and `store` the content in a variable named `inputText` which can then be passed to the `action` `click`, triggerable by clicking on the `button`.



## Packages


<a target="_blank" href="https://www.npmjs.com/package/@plurid/bluefig-server">
    <img src="https://img.shields.io/npm/v/@plurid/bluefig-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/bluefig-server][bluefig-server] • server

[bluefig-server]: https://github.com/plurid/bluefig/tree/master/packages/bluefig-server



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
