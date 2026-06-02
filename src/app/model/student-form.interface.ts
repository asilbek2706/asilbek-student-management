export interface StudentFormInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string | Date;
  gender: 'Male' | 'Female' | 'Other';

  studentId: string;
  enrollmentDate: string | Date;
  branch: 'B.TECH' | 'BCA';
  course: 1 | 2 | 3 | 4;
  status: 'active' | 'suspended' | 'graduated';

  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
