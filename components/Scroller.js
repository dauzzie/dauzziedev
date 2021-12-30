import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import TechIcon from '@/components/tech-icons'
import techStack from '@/data/techStack'


export default function Scroller({type}) {
    if(!type)
        return null
    return (
        <div>
            <div className="flex flex-col overflow-x-auto items-center pt-4 pb-4">
                <div className="flex space-x-4">
                    {
                        techStack.map((t) => ((
                            t.type == type && <TechIcon kind={t.kind} status={t.status} size="8"/>
                        )))
                    }
                </div>
            </div>
        </div>
    )
}
