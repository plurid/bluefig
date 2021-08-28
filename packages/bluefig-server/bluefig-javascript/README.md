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
    + [Use Cases](#use-cases)
    + [In Use](#in-use)
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
+ `input-slider`
+ `button`
+ `image`
+ `file`
+ `divider`
+ `list`

The `elements` used for input (`input-x`, `button`) can have an `action` field. When the user interacts with the `element` on the `bluefig-client`, the established `action` will run accordingly on the `bluefig-server`.


### Example

Considering the simple view

``` typescript
import {
    ViewsServer,
} from '@plurid/bluefig-server';


const views: ViewsServer = {
    '/': {
        title: 'Index View',
        elements: [
            {
                type: 'text',
                value: 'this is a simple view',
            },
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputTextStore',
            },
            {
                type: 'button',
                title: 'Click Me',
                action: 'clickAction',
            },
        ],
        actions: {
            'clickAction': {
                arguments: [
                    'inputTextStore',
                ],
                execution: async (
                    payload,
                ) => {
                    console.log('Click action called', payload.inputTextStore);
                },
            },
        },
    },
};
```

the `bluefig-client` will then render an interface with a text input field which will listen for changes and `store` the content in a variable named `inputText` which can then be passed to the `action` `click`, triggerable by clicking on the `button`.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/bluefig-example.png" height="500px">
</p>


The `bluefig-server` will output at click

```
> Click action called User input
```


### Use Cases

`bluefig` can be used to:

+ connect a device to Wi-Fi, by selecting from a `bluefig-server` provided list and entering the passkey;
+ set an administrator password on the device;
+ reset device to factory settings;
+ abstract the execution of complex logic, e.g. starting/stopping a process line with one button;
+ read/export device analytics;


### In Use

`bluefig` is used to configure:

+ [deserver](https://github.com/plurid/deserve/tree/master/packages/utilities/deserver-os/deserver-bluefig): admin setup, user generation, Wi-Fi selection, disk formatting, docker/processes lifecycle (setup-stop-restart).



## Packages


<a target="_blank" href="https://www.npmjs.com/package/@plurid/bluefig-server">
    <img src="https://img.shields.io/npm/v/@plurid/bluefig-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/bluefig-server][bluefig-server] • server

[bluefig-server]: https://github.com/plurid/bluefig/tree/master/packages/bluefig-server



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
