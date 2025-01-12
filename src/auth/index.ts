import NextAuth from 'next-auth';
import { authConfig } from './config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/app/lib/dataschemas';

// Rest of the file stays the same... 