import { Box, Center, Heading } from '@chakra-ui/react';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import Setting from '~/components/Teacher/CourseDetail/Setting';

const AddCoursePage = () => {
  return (
    <RoleBasedPageLayout>
      <Setting/>
    </RoleBasedPageLayout>
  );
}

export default AddCoursePage;