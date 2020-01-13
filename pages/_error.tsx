import Link from 'next/link'

function Error(props: { statusCode: number }) {
  let { statusCode } = props
  let errorText = ''

  switch (statusCode) {
    case 404:
      errorText = 'Oops! That page could not be found!'
      break

    case 500:
      errorText = 'Oops! There was some internal server error. Please try later.'
      break

    default:
      errorText = 'Oops! Something went wrong.'
      // just to show something to user
      statusCode = 404
  }

  return (
    <div className="main-body-content">
      <section className="pad-75">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="notfound-wrapper pad-100 text-center">
                <h1>{statusCode}</h1>
                <p>{errorText}</p>

                <div className="d-flex justify-content-center col-sm-12">
                  <div className="button-4">
                    <div className="eff-4"></div>
                    <Link href="/" replace={true}>
                      <a>Back To Home</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .pad-75 {
          padding-top: 75px;
          padding-bottom: 75px;
        }
        .notfound-wrapper {
          background-image: nonurl('/static/apple-icon.png');
          background-repeat: repeat;
        }
        .notfound-wrapper h1 {
          font-size: 180px;
          color: #999;
          letter-spacing: 5px;
          font-weight: bold;
          line-height: 140px;
          margin-bottom: 20px;
        }
        .notfound-wrapper p {
          color: #111;
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 30px;
          display: inline-block;
        }

        @media (max-width: 767px) {
          .pad-75 {
            padding-top: 50px;
            padding-bottom: 50px;
          }
          .notfound-wrapper h1 {
            font-size: 120px;
            margin-bottom: 0;
            line-height: 1;
          }
        }
      `}</style>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: { res: { statusCode: number }; err: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null
  return { statusCode }
}

export default Error
