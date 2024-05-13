import { logout } from "@/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const LogoutForm = () => {
    return (
        <form action={logout}>
            <button className="text-red">Logout  <FontAwesomeIcon icon={faRightFromBracket} style={{ width: '1em', height: '1em', marginRight: '23px' }} /></button>
        </form>
    );
}
export default LogoutForm;