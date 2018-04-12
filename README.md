# PhpUnitGen Web Application

This repository is a web application to use the [phpunit-generator package](https://github.com/paul-thebaud/phpunit-generator).

The application is available online, on [phpunitgen.io](https://phpunitgen.io).

## Development

To develop on this application, you will probably need to copy the
`src/local.php.dist` to `src/local.php`.

You will also need to setup a virtual with following information:
```
ServerName phpunitgen.local
ServerAlias api.phpunitgen.local doc.phpunitgen.local
```

## Running tests

No unit tests are available for the moment,
there is only the PSR-2 validation on PHP files.

```bash
$ composer cs-check
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for more details.

## Credits

- [Paul Thébaud][link-author]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
