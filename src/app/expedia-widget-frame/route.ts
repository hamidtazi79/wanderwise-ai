export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Expedia Widget</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: transparent;
            overflow: hidden;
            font-family: Arial, sans-serif;
          }

          .widget-wrap {
            width: 100%;
            max-width: 575px;
            margin: 0 auto;
            min-height: 420px;
          }
        </style>
      </head>
      <body>
        <div class="widget-wrap">
          <div
            class="eg-widget"
            data-widget="search"
            data-program="uk-expedia"
            data-lobs="stays,flights"
            data-network="pz"
            data-camref="1100l5Iqgj"
            data-pubref=""
          ></div>
        </div>

        <script
          class="eg-widgets-script"
          src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"
        ></script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
