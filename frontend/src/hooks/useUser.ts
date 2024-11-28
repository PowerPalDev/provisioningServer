import { useEffect, useState } from "react";
import { getAllUsers } from "../services/UserService";
import { User } from "../models/User";

export const useUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    const getUsers = async () => {
        try {
            const response = await getAllUsers();

            if (response && response.data) {
                setUsers(response.data);
            } else {
                console.error("Failed to retrieve users");
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return { users, getUsers };
}
