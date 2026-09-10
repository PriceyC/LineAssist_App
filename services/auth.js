import api from "./api";
import bcrypt from "bcryptjs";
import { getUser, saveUser } from "./localDB";

export const login = async (email, password, site_id) => {
    try {
        // Try online login
        const user = await api.post('/auth/login', {
            email,
            password,
            site_id
        });

        console.log('LOGIN RESPONSE:', user);

        // Cache successful login for offline use
        await saveUser(user);

        return user;

    } catch (error) {
        //if online api unsuccessful, attempt offline login
        const localUser = await getUser();

        //will fail if no user saved to offline db
        if (!localUser) {
            throw new Error('No offline user available');
        }

        // Check password against cached bcrypt hash
        const passwordValid = await bcrypt.compare(
            password,
            localUser.password_hash
        );

        if (!passwordValid) {
            throw new Error('Invalid email or password');
        }

        // Check selected site
        if (Number(localUser.site_id) !== Number(site_id)) {
            throw new Error('User is not associated with this site');
        }
        
        return {
            userid: localUser.user_id,
            name: localUser.name,
            email: localUser.email,
            role: localUser.role,
            site_id: localUser.site_id,
            password_hash: localUser.password_hash
        };
    }
};