// src/pages/admin/Settings.js
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";

export default function Settings() {
    const { user } = useAuth();

    if (!user) {
        return <p className="text-center mt-10">Loading settings...</p>;
    }

    return (
        <>
            <Navbar role="admin" />
            <div className="pt-20 px-6 flex justify-center">
                <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Admin Settings</h2>

                    {/* Info Section */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">Full Name: </span>
                            {user.fullname}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">Email: </span>
                            {user.email}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">Role: </span>
                            {user.role}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">College: </span>
                            {user.clgName}
                        </div>
                    </div>

                    {/* Future Settings Options */}
                    <div className="mt-8 text-center">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
