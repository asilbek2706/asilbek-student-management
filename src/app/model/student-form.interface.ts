export interface StudentFormInterface {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';

  studentId: string;
  enrollmentDate: string;
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
