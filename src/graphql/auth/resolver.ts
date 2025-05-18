import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const resolvers = {
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
  },
};