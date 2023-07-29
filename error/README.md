# Error Pages

Simple HTTP Error Page Generator

## Nginx Integration

```nginx
server {
    listen      80;
    server_name localhost;
    root        /var/www;
    index       index.html;

    location / {
        try_files $uri $uri/ =404;

        error_page 403 /error/403.html;
        error_page 404 /error/404.html;
        error_page 405 /error/405.html;
        error_page 500 /error/500.html;
        error_page 501 /error/501.html;
        error_page 502 /error/502.html;
        error_page 503 /error/503.html;

        location ^~ /error/ {
            internal;
            root /var/www/default;
        }
}
```

## Apache Integration

```apache
ErrorDocument 400 /error/400.html
ErrorDocument 401 /error/401.html
ErrorDocument 403 /error/403.html
ErrorDocument 404 /error/404.html
ErrorDocument 500 /error/500.html
ErrorDocument 501 /error/501.html
ErrorDocument 502 /error/502.html
ErrorDocument 503 /error/503.html
```

## Lighttpd Integration

```lighttpd
server.errorfile-prefix = "/var/www/error"
```
