import { cookies } from 'next/headers';

const PatientsDashboard = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log("All cookies:", cookieStore.getAll()); // সব cookies দেখুন
    console.log("Access Token:", accessToken);

    return (
        <div>
            <p>Token: {accessToken || "No token found"}</p>
        </div>
    );
};

export default PatientsDashboard;