'use Client'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-regular-svg-icons";

export default function NotificationBellButton() {
    return (
        <div className="notifcation">
            <a href="#!">
                <FontAwesomeIcon icon={faBell}/>
            </a>
        </div>
    )
}