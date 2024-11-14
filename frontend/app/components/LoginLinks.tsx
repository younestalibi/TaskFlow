import { Link } from "@remix-run/react";


const LoginLinks = ({ user }) => {
    console.log(user)
    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
            {user ? (
                <>
                    <b className="ml-4 text-sm text-gray-700">
                        {user.name}
                    </b>
                    <Link
                        to="/dashboard"
                        className="ml-4 text-sm text-gray-700 underline"
                    >
                        Dashboard
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        to="/login"
                        className="text-sm text-gray-700 underline"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="ml-4 text-sm text-gray-700 underline"
                    >
                        Register
                    </Link>
                </>
            )}
        </div>
    )
}

export default LoginLinks
