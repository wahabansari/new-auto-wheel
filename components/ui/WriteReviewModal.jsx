// "use client";
// import {
//   ActionIcon,
//   Box,
//   Card,
//   Flex,
//   Group,
//   Image,
//   Input,
//   List,
//   Modal,
//   Paper,
//   Rating,
//   rem,
//   Text,
//   Textarea,
//   Title,
//   Button,
// } from "@mantine/core";
// import React, { useEffect, useState } from "react";
// import {
//   EmohiVeryHappy,
//   EmojiDisappointed,
//   EmojiHappy,
//   EmojiPlain,
//   EmojiSad,
// } from "../Icons";
// import { FaStar } from "react-icons/fa6";
// import { postDataToServer } from "@/actions";
// import { API_ENDPOINTS } from "@/constants/api-endpoints";
// import axios from "axios";
// import CustomModel from "@/constants/CustomModel";
// import { fetchListData, fetchMakesByType } from "@/services/vehicles";
// import { showNotification } from '@mantine/notifications';
// import { useSession } from "next-auth/react";

// const WriteReviewModal = ({ opened, close, fetchMakesByTypeData, fetchReviews }) => {
//   const { data: session, status } = useSession();

//   const [ratings, setRatings] = useState({
//     mileage: 0,
//     safety: 0,
//     comfort: 0,
//     maintenance: 0,
//     performance: 0,
//     features: 0
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const [reviewText, setReviewText] = useState('');
//   const [reviewTitle, setReviewTitle] = useState('');
//   const [error, setError] = useState('');
//   const [averageRating, setAverageRating] = useState(0);
//   const [wantRatings, setWantRatings] = useState(false);
//   const [makes, setMakes] = useState({});
//   const [selection, setSelection] = useState({
//     make: '',
//     model: '',
//     variant: '',
//   });
//   // const handleRatingChange = (category, value) => {
//   //   setRatings((prevRatings) => ({
//   //     ...prevRatings,
//   //     [category]: value,
//   //   }));


//   // };
//   useEffect(() => {
//     clearForm();
//   }, []);
//   const clearForm=()=>{
//     setSelection({
//       make: '',
//       model: '',
//       variant: '',
//     });
//     setReviewText(""); // Clear form
//     setReviewTitle("")
//     setRatings({
//       Mileage: 0,
//       Safety: 0,
//       Comfort: 0,
//       Performance: 0,
//       MaintenanceCost: 0,
//       FeaturesAndStyling: 0,
//     });
//     setIsModalOpen(false); 
//     setWantRatings(false);
//   }
//   const makeModeHanlde=()=>{
//     setIsModalOpen(true); 
//     setWantRatings(true)
//   }


//   const handleRatingChange = (category, value) => {
//     setRatings((prevRatings) => {
//       const updatedRatings = {
//         ...prevRatings,
//         [category]: value,
//       };

//       // Calculate the new average
//       const totalRatings = Object.values(updatedRatings).reduce((sum, rating) => sum + rating, 0);
//       const newAverage = totalRatings / Object.keys(updatedRatings).length;

//       // Update the average rating state
//       setAverageRating(newAverage.toFixed(1));

//       return updatedRatings;
//     });
//   };

//   const getEmptyIcon = (value) => {
//     switch (value) {
//       case 1:
//         return (
//           <EmojiSad style={{ marginRight: rem(5) }} selectedColor="#B1B1B1" />
//         );
//       case 2:
//         return (
//           <EmojiDisappointed
//             style={{ marginRight: rem(5) }}
//             selectedColor="#B1B1B1"
//           />
//         );
//       case 3:
//         return (
//           <EmojiPlain style={{ marginRight: rem(5) }} selectedColor="#B1B1B1" />
//         );
//       case 4:
//         return (
//           <EmojiHappy style={{ marginRight: rem(5) }} selectedColor="#B1B1B1" />
//         );
//       case 5:
//         return (
//           <EmohiVeryHappy
//             style={{ marginRight: rem(5) }}
//             selectedColor="#B1B1B1"
//           />
//         );
//       default:
//         return null;
//     }
//   };
//   const getFullIcon = (value) => {
//     switch (value) {
//       case 1:
//         return (
//           <EmojiSad style={{ marginRight: rem(5) }} selectedColor="#FFC513" />
//         );
//       case 2:
//         return (
//           <EmojiDisappointed
//             style={{ marginRight: rem(5) }}
//             selectedColor="#FFC513"
//           />
//         );
//       case 3:
//         return (
//           <EmojiPlain style={{ marginRight: rem(5) }} selectedColor="#FFC513" />
//         );
//       case 4:
//         return (
//           <EmojiHappy style={{ marginRight: rem(5) }} selectedColor="#FFC513" />
//         );
//       case 5:
//         return (
//           <EmohiVeryHappy
//             style={{ marginRight: rem(5) }}
//             selectedColor="#FFC513"
//           />
//         );
//       default:
//         return null;
//     }
//   };
//   // Submit handler for the review form

//   console.log('>>> Submit handler for the review form',session?.user?.name)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const reviewData = {
//       vehicle: `${selection?.make} ${selection?.model} ${selection?.variant}`,
//       ratings,
//       reviewText,
//       reviewTitle,
//       reviewBy:session?.user?.name ? session.user.name : session.user.fullName
//     };

//     try {
//       // setIsModalOpen(false);
//       // close();

//       const response = await axios.post(API_ENDPOINTS.REVIEWS.SUBMIT, reviewData, {
//         headers: {
//           'Content-Type': 'application/json',  // Explicitly set Content-Type for JSON
//         },
//       });
//       // Make a POST request to submit the review
//       // if (response.data.statusCode == 200) {
//         if(fetchReviews) await fetchReviews()
//         showNotification({
//           title: 'Review Submitted',
//           message: 'Your review has been submitted successfully.',
//           color: 'green',
//         });
//         clearForm();
//         close();
//         // Show success notification

//       // }
//     } catch (err) {
//       showNotification({
//         title: 'Something Went Wrong',
//         message: err?.response?.data?.message,
//         color: 'red',
//       });
//       setError('An error occurred while submitting your review.');
//     }
//   };

//   const calculateAverageRating = (reviews) => {
//     const categories = ['mileage', 'maintenance', 'safety', 'comfort', 'features', 'performance'];
//     const averageRatings = {};

//     categories.forEach((category) => {
//       const total = reviews.reduce((sum, review) => sum + review.ratings[category], 0);
//       averageRatings[category] = total / reviews.length;
//     });

//     return averageRatings;
//   };


//   return (
//     <>
//       <Modal
//         opened={opened}
//         onClose={close}
//         withCloseButton
//         padding="xl"
//         size="50%"
//         title={
//           <Text size="xl" fw={600}>
//             Rate & Review {selection.make}  {selection.model}  {selection.variant} and Win
//           </Text>
//         }
//       >
//         <form onSubmit={handleSubmit}>
//           {/* Code For First Modal */}
//           {wantRatings && <Box className="row">
//             <Box className="col-md-7">

//               <Title order={4} fw={600} mt="md" mb="md">
//                 Rate your Experience
//               </Title>
//               <Group mb="sm">
//                 <Text w="20ch">Mileage</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.mileage}
//                   onChange={(value) => handleRatingChange('mileage', value)}

//                 />
//               </Group>
//               <Group mb="sm">
//                 <Text w="20ch">Maintenance Cost</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.maintenance}
//                   onChange={(value) => handleRatingChange('maintenance', value)}
//                 />

//               </Group>
//               <Group mb="sm">
//                 <Text w="20ch">Safety</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.safety}
//                   onChange={(value) => handleRatingChange('safety', value)}
//                 />
//               </Group>
//               <Group mb="sm">
//                 <Text w="20ch">Features and Styling</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.features}
//                   onChange={(value) => handleRatingChange('features', value)}
//                 />
//               </Group>
//               <Group mb="sm">
//                 <Text w="20ch">Comfort</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.comfort}
//                   onChange={(value) => handleRatingChange('comfort', value)}
//                 />
//               </Group>
//               <Group mb="sm">
//                 <Text w="20ch">Performance</Text>
//                 <Rating
//                   emptySymbol={getEmptyIcon}
//                   fullSymbol={getFullIcon}
//                   highlightSelectedOnly
//                   value={ratings.performance}
//                   onChange={(value) => handleRatingChange('performance', value)}
//                 />
//               </Group>
//             </Box>
//             <Box className="col-md-5">
//               <Paper p="lg" shadow="0px 4px 20px 0px #00000014" withBorder>
//                 <Group mb="md">
//                   <Image src="/bulb-icon.svg" alt="Bulb Icon" />
//                   <Text fw={600}>Tips for a Good Review</Text>
//                 </Group>
//                 <List c="dimmed" spacing="md" listStyleType="disc" size="sm">
//                   <List.Item>
//                     Tell us about your buying experience and why you shortlisted
//                     this car
//                   </List.Item>
//                   <List.Item>List out the pros and cons of your car</List.Item>
//                   <List.Item>
//                     Talk about the overall performance of your car, mileage, pickup,
//                     comfort level, etc
//                   </List.Item>
//                   <List.Item>
//                     How's the after-sales service and what are the costs involved
//                   </List.Item>
//                   <List.Item>Give a suitable title to your review</List.Item>
//                   <List.Item>
//                     Don't use all caps and avoid sharing personal details here
//                   </List.Item>
//                 </List>
//               </Paper>
//             </Box>
//           </Box>}
//           {/* Code For First Modal */}
//           <Box className="row">
//             <Box className="col-md-7">
//               <Card
//                 shadow="0px 4px 20px 0px #00000014"
//                 padding={0}
//                 mb="md"
//                 target="_blank"
//                 withBorder
//               >
//                 <Flex align="center" gap="sm">
//                   <Card.Section>
//                     <Image
//                       src="/blogs/blogs-1.png"
//                       alt="No way!"
//                       w={100}
//                       h="100%"
//                     />
//                   </Card.Section>
//                   <Text fw={600} size="lg" h="100%">
//                     <Text size="md" c="dimmed" fw={400} >
//                       Rate and Review
//                     </Text>
//                     {selection.make}  {selection.model}  {selection.variant}
//                     <ActionIcon ml="sm" variant="transparent" color="#E90808" onClick={makeModeHanlde}>
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 12 12"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M1.5 8.62492V10.4999H3.375L8.905 4.96992L7.03 3.09492L1.5 8.62492ZM10.705 3.16992L8.83 1.29492L7.565 2.56492L9.44 4.43992L10.705 3.16992Z"
//                           fill="currentColor"
//                         />
//                       </svg>
//                     </ActionIcon>
//                     {getFullIcon}
//                   </Text>
//                 </Flex>
//               </Card>
//               <Paper bg="#F3F3F3" ta="center" p="lg" mb="md">
//                 <Title order={5} fw={500} mb="xs">
//                   Your Overall Rating:
//                 </Title>
//                 <Flex justify="center" align="center" gap="2">
//                   <FaStar fontSize={rem(30)} color="#FFA236" />
//                   <Text fw={600} size={rem(24)}>
//                     {averageRating}

//                   </Text>
//                 </Flex>
//               </Paper>
//               {getFullIcon}
//               <Box mb="md">
//                 <Textarea
//                   placeholder="Share the details of your experience"
//                   rows={4}
//                   cols={4}
//                   onChange={(e) => setReviewText(e.target.value)}
//                 />
//                 <Text c="dimmed" size="xs" mt={5} ta="end">
//                   Minimum 100 characters
//                 </Text>
//               </Box>
//               <Box mb="md">
//                 <Input placeholder="Title of your Review" onChange={(e) => setReviewTitle(e.target.value)} />
//                 <Text c="dimmed" size="xs" mt={5} ta="end">
//                   Minimum 100 characters
//                 </Text>
//               </Box>
//               <Button color="#E90808" fullWidth type="submit">
//                 Submit Review
//               </Button>
//             </Box>
//             <Box className="col-md-5">
//               <Paper p="lg" shadow="0px 4px 20px 0px #00000014" withBorder>
//                 <Group mb="md">
//                   <Image src="/bulb-icon.svg" alt="Bulb Icon" />
//                   <Text fw={600}>Tips for a Good Review</Text>
//                 </Group>
//                 <List c="dimmed" spacing="md" listStyleType="disc" size="sm">
//                   <List.Item>
//                     Tell us about your buying experience and why you shortlisted
//                     this car
//                   </List.Item>
//                   <List.Item>List out the pros and cons of your car</List.Item>
//                   <List.Item>
//                     Talk about the overall performance of your car, mileage, pickup,
//                     comfort level, etc
//                   </List.Item>
//                   <List.Item>
//                     How's the after-sales service and what are the costs involved
//                   </List.Item>
//                   <List.Item>Give a suitable title to your review</List.Item>
//                   <List.Item>
//                     Don't use all caps and avoid sharing personal details here
//                   </List.Item>
//                 </List>
//               </Paper>
//             </Box>
//           </Box>
//         </form>
//       </Modal>

//       <CustomModel isOpen={isModalOpen} selection={selection} setSelection={setSelection} onClose={closeModal} fetchMakesByTypeData={fetchMakesByTypeData} hide={false} />

//     </>
//   );
// };

// export default WriteReviewModal;

"use client";
import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Group,
  Image,
  Input,
  List,
  Modal,
  Paper,
  Rating,
  rem,
  Text,
  Textarea,
  Title,
  Button,
} from "@mantine/core";
import React, {useState } from "react";
import {
  EmohiVeryHappy,
  EmojiDisappointed,
  EmojiHappy,
  EmojiPlain,
  EmojiSad,
} from "../Icons";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import CustomModel from "@/constants/CustomModel";
import { showNotification } from '@mantine/notifications';
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const WriteReviewModal = ({ opened, close, fetchMakesByTypeData, fetchReviews }) => {
  const { data: session } = useSession();

  const [ratings, setRatings] = useState({
    mileage: 0,
    safety: 0,
    comfort: 0,
    maintenance: 0,
    performance: 0,
    features: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [wantRatings, setWantRatings] = useState(false);
  const [selection, setSelection] = useState({
    make: '',
    model: '',
    variant: '',
  });

  const clearForm = () => {
    setWantRatings(false);
    setSelection({ make: '', model: '', variant: '' });
    setReviewText("");
    setReviewTitle("");
    setRatings({ mileage: 0, safety: 0, comfort: 0, maintenance: 0, performance: 0, features: 0 });
    close();
  };
  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => {
      const updatedRatings = { ...prevRatings, [category]: value };
      const totalRatings = Object.values(updatedRatings).reduce((sum, rating) => sum + rating, 0);
      setAverageRating((totalRatings / Object.keys(updatedRatings).length).toFixed(1));
      return updatedRatings;
    });
  };

  const getIcon = (value, selectedColor) => {
    const iconProps = { style: { marginRight: rem(5) }, selectedColor };
    switch (value) {
      case 1: return <EmojiSad {...iconProps} />;
      case 2: return <EmojiDisappointed {...iconProps} />;
      case 3: return <EmojiPlain {...iconProps} />;
      case 4: return <EmojiHappy {...iconProps} />;
      case 5: return <EmohiVeryHappy {...iconProps} />;
      default: return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      vehicle: `${selection?.make} ${selection?.model} ${selection?.variant}`,
      ratings,
      reviewText,
      reviewTitle,
      reviewBy: session?.user?.name || session?.user?.fullName,
    };
    if (!selection?.make|| !selection?.model) {
      showNotification({
        title: 'Please select atleast make and model',
        color: 'red',
      });
      return
    }
    if(!reviewText?.trim()){
      showNotification({
        title: 'Please write detail of your review',
        color: 'red',
      });
      return
    }
    if(!reviewTitle?.trim()){
      showNotification({
        title: 'Please write title of your review',
        color: 'red',
      });
      return
    }
    try {
      setLoading(true);
      await axios.post(API_ENDPOINTS.REVIEWS.SUBMIT, reviewData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (fetchReviews) await fetchReviews();
      showNotification({
        title: 'Review Submitted',
        message: 'Your review has been submitted successfully.',
        color: 'green',
      });
      clearForm();
      setLoading(false);
    } catch (err) {
      showNotification({
        title: 'Something Went Wrong',
        message: err?.response?.data?.message,
        color: 'red',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={clearForm}
        withCloseButton
        padding="xl"
        size="50%"
        title={
          <Text size="xl" fw={600}>
            Rate & Review {selection.make} {selection.model} {selection.variant} and Win
          </Text>
        }
      >
        <form onSubmit={handleSubmit}>
          {wantRatings && (
            <Box className="row">
              <Box className="col-md-7">
                <Title order={4} fw={600} mt="md" mb="md">
                  Rate your Experience
                </Title>
                {Object.keys(ratings).map((category) => (
                  <Group key={category} mb="sm">
                    <Text w="20ch">{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                    <Rating
                      emptySymbol={(value) => getIcon(value, "#B1B1B1")}
                      fullSymbol={(value) => getIcon(value, "#FFC513")}
                      highlightSelectedOnly
                      value={ratings[category]}
                      onChange={(value) => handleRatingChange(category, value)}
                    />
                  </Group>
                ))}
              </Box>
              <Box className="col-md-5">
                <Paper p="lg" shadow="0px 4px 20px 0px #00000014" withBorder>
                  <Group mb="md">
                    <Image src="/bulb-icon.svg" alt="Bulb Icon" />
                    <Text fw={600}>Tips for a Good Review</Text>
                  </Group>
                  <List c="dimmed" spacing="md" listStyleType="disc" size="sm">
                    <List.Item>Tell us about your buying experience and why you shortlisted this car</List.Item>
                    <List.Item>List out the pros and cons of your car</List.Item>
                    <List.Item>Talk about the overall performance of your car, mileage, pickup, comfort level, etc</List.Item>
                    <List.Item>How's the after-sales service and what are the costs involved</List.Item>
                    <List.Item>Give a suitable title to your review</List.Item>
                    <List.Item>Don't use all caps and avoid sharing personal details here</List.Item>
                  </List>
                </Paper>
              </Box>
            </Box>
          )}
          <Box className="row">
            <Box className="col-md-7">
              <Card shadow="0px 4px 20px 0px #00000014" padding={0} mb="md" target="_blank" withBorder>
                <Flex align="center" gap="sm">
                  <Card.Section>
                    <Image src="/blogs/blogs-1.png" alt="No way!" w={100} h="100%" />
                  </Card.Section>
                  <Text fw={600} size="lg">
                    <Text size="md" c="dimmed" fw={400}>Rate and Review</Text>
                    {selection.make} {selection.model} {selection.variant}
                    <ActionIcon ml="sm" variant="transparent" color="#E90808" onClick={() => { setIsModalOpen(true); setWantRatings(true); }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 8.62492V10.4999H3.375L8.905 4.96992L7.03 3.09492L1.5 8.62492ZM10.705 3.16992L8.83 1.29492L7.565 2.56492L9.44 4.43992L10.705 3.16992Z"
                          fill="currentColor"
                        />
                      </svg>
                    </ActionIcon>
                  </Text>
                </Flex>
              </Card>
              <Paper bg="#F3F3F3" ta="center" p="lg" mb="md">
                <Title order={5} fw={500} mb="xs">Your Overall Rating:</Title>
                <Flex justify="center" align="center" gap="2">
                  <FaStar fontSize={rem(30)} color="#FFA236" />
                  <Text fw={600} size={rem(24)}>{averageRating}</Text>
                </Flex>
              </Paper>
              <Box mb="md">
                <Textarea
                  placeholder="Share the details of your experience"
                  rows={4}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <Text c="dimmed" size="xs" mt={5} ta="end">Minimum 100 characters</Text>
              </Box>
              <Box mb="md">
                <Input
                  placeholder="Title of your Review"
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
                <Text c="dimmed" size="xs" mt={5} ta="end">Minimum 100 characters</Text>
              </Box>
              <Button color="#E90808" fullWidth type="submit" disabled={loading}>Submit Review</Button>
            </Box>
            <Box className="col-md-5">
              <Paper p="lg" shadow="0px 4px 20px 0px #00000014" withBorder>
                <Group mb="md">
                  <Image src="/bulb-icon.svg" alt="Bulb Icon" />
                  <Text fw={600}>Tips for a Good Review</Text>
                </Group>
                <List c="dimmed" spacing="md" listStyleType="disc" size="sm">
                  <List.Item>Tell us about your buying experience and why you shortlisted this car</List.Item>
                  <List.Item>List out the pros and cons of your car</List.Item>
                  <List.Item>Talk about the overall performance of your car, mileage, pickup, comfort level, etc</List.Item>
                  <List.Item>How's the after-sales service and what are the costs involved</List.Item>
                  <List.Item>Give a suitable title to your review</List.Item>
                  <List.Item>Don't use all caps and avoid sharing personal details here</List.Item>
                </List>
              </Paper>
            </Box>
          </Box>
        </form>
      </Modal>
      <CustomModel isOpen={isModalOpen} selection={selection} setSelection={setSelection} onClose={() => setIsModalOpen(false)} fetchMakesByTypeData={fetchMakesByTypeData} hide={false} />
    </>
  );
};

export default WriteReviewModal;