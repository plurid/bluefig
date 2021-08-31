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

The `bluefig-server` runs on the device and the user connects to it through the `bluefig-client`, running on a common user terminal.

The user then interacts with the `bluefig-client`, effectively changing the internal state of the `bluefig-server` machine, within the limits of the `views` (`elements` and `actions`) specified by the `bluefig-server`.


### Contents

+ [Usage](#usage)
    + [Example](#example)
    + [Configuration](#configuration)
    + [Use Cases](#use-cases)
    + [In Use](#in-use)
+ [Elements](#elements)
    + [`text`](#text)
    + [`input-text`](#input-text)
    + [`input-select`](#input-select)
    + [`input-switch`](#input-switch)
    + [`input-slider`](#input-slider)
    + [`button`](#button)
    + [`image`](#image)
    + [`file`](#file)
    + [`divider`](#divider)
    + [`list`](#list)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## Usage

The `bluefig-server` will load at start a list of `views` and `hooks` which will determine the `bluefig-client` user interface and the `bluefig-server` behavior.

A bluefig `view` is comprised of `elements` and `actions`.

The [`elements`](#elements) will be sent by the `bluefig-server` to be rendered by the `bluefig-client`.

The `elements` used for input (`input-x`, `button`) can have an `action` field. When the user interacts with the `element` on the `bluefig-client`, the established `action` will run accordingly on the `bluefig-server`.

An `action` is an `async function` which can return another `view`; either one already defined in the `views` object, or something dynamically computed based on the functions `payload`, the object containing all the `arguments` passed from the `store`.

Any `action` will also have as the second argument a `notify` function which will push a notification to the `bluefig-client`, and as the third argument an `event` function which can be used to trigger a `bluefig-server` event, such as `set-token` to set the access token.


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

the `bluefig-client` will then render an interface with a text input field which will listen for changes and `store` the content in a variable named `inputTextStore` which can then be passed to the `action` `clickAction`, triggerable by clicking on the `button`.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/bluefig-example.png" height="400px">
</p>


The `bluefig-server` will output at click

```
> Click action called input text
```


### Configuration

The `bluefig-server` will by default load the `views` and `hooks` from `~/.bluefig`.

Custom `views` and `hooks` paths can be provided using the environment variables `BLUEFIG_VIEWS_PATH` and `BLUEFIG_HOOKS_PATH`.

The environment variable `BLUEFIG_SERVICE_NAME` can be used to set the name appearing in the `bluefig-client` scan list.


### Use Cases

`bluefig` can be used to:

+ connect a device to Wi-Fi, by selecting from a `bluefig-server` provided list and entering the passkey;
+ set an administrator password on the device;
+ reset device to factory settings;
+ abstract the execution of complex logic, e.g. starting/stopping a process line with one button;
+ read/export device analytics;
+ read/write custom configuration files†;
+ execute custom shell commands†;

† In order to ensure the device security, the interaction with configuration files/shell commands should be done indirectly, the `bluefig-server` exposing only a limited interaction mode to the `bluefig-client`.


### In Use

`bluefig` is used to configure:

+ [deserver](https://github.com/plurid/deserve/tree/master/packages/utilities/deserver-os/deserver-bluefig): admin setup, user generation, Wi-Fi selection, disk formatting, docker/processes lifecycle (setup-stop-restart).



## Elements

The `elements` of a `view` are comprised of `ViewElement`s.

``` typescript
export type ViewElement =
    | ViewText
    | ViewInputText
    | ViewInputSelect
    | ViewInputSwitch
    | ViewInputSlider
    | ViewButton
    | ViewImage
    | ViewFile
    | ViewDivider
    | ViewList;
```

Any field of an `element`, except the `type`, can receive a static value (`string`, `boolean`, etc.), or an `async function` which will be evaluated at view-request time.


Helper types

``` typescript
export type PromiseOf<T> = () => Promise<T>;
export type TypeOrPromiseOf<T> = T | PromiseOf<T>;

export type StringOrPromiseOf = TypeOrPromiseOf<string>;
export type StringArrayOrPromiseOf = TypeOrPromiseOf<string[]>;
export type NumberOrPromiseOf = TypeOrPromiseOf<number>;
export type BooleanOrPromiseOf = TypeOrPromiseOf<boolean>;
export type StringOrNumberOrPromiseOf = TypeOrPromiseOf<string | number>;
export type StringOrNumberOrStringNumberArrayOrPromiseOf = TypeOrPromiseOf<string | number | (string | number)[]>;
export type ViewElementsOrPromiseOf = TypeOrPromiseOf<ViewElement[]>;
```


### text

``` typescript
export interface ViewText {
    type: 'text';
    value: StringOrPromiseOf;
    selectable?: BooleanOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/text': {
        title: 'text',
        elements: [
            {
                type: 'text',
                value: 'Text',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.text.png" height="400px">
</p>


### input-text

``` typescript
export interface ViewInputText {
    type: 'input-text';
    title?: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: StringOrPromiseOf;
    secure?: BooleanOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/input-text': {
        title: 'input text',
        elements: [
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputText',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.input-text.png" height="400px">
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.input-text2.png" height="400px">
</p>


### input-select

``` typescript
export interface ViewInputSelect {
    type: 'input-select';
    title?: StringOrPromiseOf;
    /**
     * Select from the options list.
     */
    options: StringArrayOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: StringOrNumberOrStringNumberArrayOrPromiseOf;
    /**
     * Allow for multiple selection.
     */
    multiple?: BooleanOrPromiseOf;
    /**
     * Set initial value, index of `options`.
     */
    action?: StringOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/input-select': {
        title: 'input select',
        elements: [
            {
                type: 'input-select',
                title: 'Input Select',
                store: 'inputSelect',
                options: [
                    'one',
                    'two',
                    'three',
                ],
                initial: 1,
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.input-select.png" height="400px">
</p>


### input-switch

``` typescript
export interface ViewInputSwitch {
    type: 'input-switch';
    title: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: BooleanOrPromiseOf;
    action?: StringOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/input-switch': {
        title: 'input switch',
        elements: [
            {
                type: 'input-switch',
                title: 'Input Switch',
                store: 'inputSwitch',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.input-switch.png" height="400px">
</p>


### input-slider

``` typescript
export interface ViewInputSlider {
    type: 'input-slider';
    title: StringOrPromiseOf;
    store: StringOrPromiseOf;
    initial?: NumberOrPromiseOf;
    action?: StringOrPromiseOf;
    maximum?: NumberOrPromiseOf;
    minimum?: NumberOrPromiseOf;
    step?: NumberOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/input-slider': {
        title: 'input slider',
        elements: [
            {
                type: 'input-slider',
                title: 'Input Slider',
                store: 'inputSlider',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.input-slider.png" height="400px">
</p>


### button

``` typescript
export interface ViewButton {
    type: 'button';
    title: StringOrPromiseOf;
    action: StringOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/button': {
        title: 'button',
        elements: [
            {
                type: 'button',
                title: 'Button',
                action: 'actionButton',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.button.png" height="400px">
</p>


### image

``` typescript
export type ViewImageAlignment = 'left' | 'right' | 'center';

export interface ViewImage {
    type: 'image';
    source: StringOrPromiseOf;
    contentType?: StringOrPromiseOf;
    height?: NumberOrPromiseOf;
    width?: NumberOrPromiseOf;
    alignment?: ViewImageAlignment | PromiseOf<ViewImageAlignment>;
}
```

``` typescript
// tests/example.all.js
    '/image': {
        title: 'image',
        elements: [
            {
                type: 'image',
                source: 'bluefig-logo-128x128.jpg',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.image.png" height="400px">
</p>


### file

``` typescript
export interface ViewFile {
    type: 'file';
    title: StringOrPromiseOf;
    source: StringOrPromiseOf;
    contentType?: StringOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/file': {
        title: 'file',
        elements: [
            {
                type: 'file',
                title: 'Sample File.png',
                source: 'a-file.txt',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.file.png" height="400px">
</p>


### divider

``` typescript
export interface ViewDivider {
    type: 'divider';
}
```

``` typescript
// tests/example.all.js
    '/divider': {
        title: 'divider',
        elements: [
            {
                type: 'divider',
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.divider.png" height="400px">
</p>


### list

``` typescript
export interface ViewList {
    type: 'list';
    items: ViewElementsOrPromiseOf;
}
```

``` typescript
// tests/example.all.js
    '/list': {
        title: 'list',
        elements: [
            {
                type: 'list',
                items: [
                    {
                        type: 'text',
                        value: 'Text In List',
                    },
                    {
                        type: 'input-text',
                        title: 'Input Text In List',
                        store: 'inputTextInList',
                    },
                ],
            },
        ],
    },
```

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/bluefig/master/about/presentation/elements/element.list.png" height="400px">
</p>



## Packages


<a target="_blank" href="https://www.npmjs.com/package/@plurid/bluefig-server">
    <img src="https://img.shields.io/npm/v/@plurid/bluefig-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/bluefig-server][bluefig-server] • server

[bluefig-server]: https://github.com/plurid/bluefig/tree/master/packages/bluefig-server



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
