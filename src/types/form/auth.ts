export interface SignUpFirstStepData {
    email:  string;
    role:   string;
}

export interface SignUpTeacherData {
    email:      string;
    name:       string;
    password:   string;
    passwordConfirm: string;
    subjects:   string;
}

export interface SignUpSchoolSkeletonData {
    email:      string;
    name:       string;
    om:         string;
    region:     string;
    postalCode: string;
    city:       string;
    address:    string;
}

export interface SignUpSchoolContactData {
    phone:      string;
    email:      string;
    website:    string;
}