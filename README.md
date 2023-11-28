# PreUpVer Library

## Introduction

PreUpVer is a versatile JavaScript library designed to automatically update the version numbers of library scripts in your documentation. It identifies specific `<pre>` tags on your webpage and updates them with the latest version tag fetched from a specified repository, ensuring your documentation always displays up-to-date information.

## Installation

To use PreUpVer in your project, include the minified library in the header of your HTML page:

```html
<!-- Include the PreUpVer script from jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/Llewellynvdm/PreUpVer@1.0.0/dist/js/preupver.min.js"></script>
```

## How It Works

PreUpVer operates by searching for `<pre>` tags with a designated class (`preupver`) and using their data attributes to perform version updates. It simplifies the process of keeping your library references up-to-date in documentation.

### Automatic Detection and Updating

When the webpage loads, PreUpVer finds all `<pre>` tags marked with the `preupver` class. It then extracts necessary details from their data attributes and updates each tag with the latest library version.

### Usage

1. **Marking `<pre>` Tags:**

   Add the `class="preupver"` to `<pre>` tags in your HTML and define the required data attributes for automatic updating:

   ```html
   <pre id="unique-id" class="preupver"
        data-api-url="https://api.github.com/repos/username/library/tags"
        data-description="Description of the library script"
        data-url="https://cdn.jsdelivr.net/gh/username/library@${version}/dist/library.min.js">
   </pre>
   ```

   Replace `unique-id`, `username`, `library`, and other placeholders with your specific details.

2. **Attributes Explained:**

   - `id`: A unique identifier for the `<pre>` tag.
   - `data-api-url`: The API URL to fetch the latest library version.
   - `data-description`: A brief description of the library script.
   - `data-url`: The URL of the script, where `${version}` will be replaced with the latest version number.

### Example

Check out the [tests](https://git.vdm.dev/Llewellyn/PreUpVer/src/branch/master/tests/) folder for the examples we use to test if this library works as expected.

## Advanced Usage

For more advanced scenarios, PreUpVer also provides `TargetLibrary` and `IncludeVersionUpdater` classes, which can be used to manually configure and update `<pre>` tags. This is particularly useful for custom implementations or testing purposes.

### Manual Configuration

You can manually create instances of `TargetLibrary` and `IncludeVersionUpdater` for specific `<pre>` tags. Refer to the `/tests` directory in the repository for examples and test cases.

## Contributing

We welcome contributions to PreUpVer. Please refer to the repository's contribution guidelines for more information on how to contribute.

## License

PreUpVer is open-source software licensed under the [MIT license](https://git.vdm.dev/Llewellyn/PreUpVer/src/branch/master/LICENSE.md).
