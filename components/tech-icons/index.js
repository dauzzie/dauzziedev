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

const TechIcon = ({ key, kind, status, size = 8}) => {


    const TechSvg = components[kind]

    return (
        <div key={key} className="has-tooltip">
            <span className="sr-only">{kind}</span>
            <span className='tooltip rounded shadow-md p-1 bg-opacity-50 text-opacity-50 bg-gray-100 dark:bg-gray-600 text-purple-600 dark:text-purple-300 text-xs -mt-8'>{kind}</span>
            <TechSvg
                key={key} className={`fill-current h-${size} w-${size} text-gray-700 text-opacity-${status*10} dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400`}
            />
        </div>
    )
}

export default TechIcon
