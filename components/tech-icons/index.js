// import Mail from './mail.svg'
// import Github from './github.svg'
// import Facebook from './facebook.svg'
// import Youtube from './youtube.svg'
// import Linkedin from './linkedin.svg'
// import Twitter from './twitter.svg'
import Python from './python.svg'
import Javascript from './js.svg'
import GraphQL from './graphql.svg'
import Rust from './rust.svg'
import Flutter from './flutter.svg'

// Icons taken from: https://simpleicons.org/

const components = {
    "js": Javascript,
    "python": Python,
    "graphql": GraphQL,
    "rust": Rust,
    "flutter": Flutter
}

const TechIcon = ({ kind, status, size = 8}) => {


    const TechSvg = components[kind]

    return (
        <div>
            <span className="sr-only">{kind}</span>
            <TechSvg
                className={`fill-current h-${size} w-${size} text-gray-700 text-opacity-${status*10} dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400`}
            />
        </div>
    )
}

export default TechIcon
