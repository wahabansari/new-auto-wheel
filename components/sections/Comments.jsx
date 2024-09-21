"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { useDisclosure } from "@mantine/hooks";
import WriteReviewModal from "../ui/WriteReviewModal";
import { NotificationsProvider, showNotification } from '@mantine/notifications';



import {
    Anchor,
    Box,
    Group,
    Button,
    Card,
    Title,
    Text,
    Image,
    Flex,
    Rating,
    rem,
    Grid,
    Tabs,
    Center,
    Collapse
} from "@mantine/core";
import NextImage from "next/image";
import Link from "next/link";
import { getAllReviews } from "@/services/vehicles";
import { formatToMonthYear } from "@/utils";
import { useSession, signOut } from "next-auth/react";

const Comments = ({ vehicleType, fetchMakesByTypeData }) => {
    const { data: session, status } = useSession();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    // const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // Initialize filter state

    const [reviews, setReviews] = useState([]);
    const [counts, setCounts] = useState({
        service: 0,
        mileage: 0,
        looks: 0,
        comfort: 0,
        space: 0,
        power: 0,
        // total: 0,
    });
    const filterOptions = [
        { type: 'all', label: 'All', countKey: 'total' },
        { type: 'service', label: 'Service', countKey: 'service' },
        { type: 'mileage', label: 'Mileage', countKey: 'mileage' },
        { type: 'looks', label: 'Looks', countKey: 'looks' },
        { type: 'comfort', label: 'Comfort', countKey: 'comfort' },
        { type: 'space', label: 'Space', countKey: 'space' },
        { type: 'power', label: 'Power', countKey: 'power' },
    ];

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getAllReviews(filter);
            setReviews(response);
            setReviews(response?.reviews);
            setCounts(response?.stats);
        } catch (err) {
            setError('Error fetching reviews');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReviews();
    }, [filter]);

    return (
        <>
            <section className="latest-reviews py-5">
                <div className="container">
                    <Card shadow="0px 4px 20px 0px #00000014" padding="xl">
                        <Title order={2} mb="lg">
                            Latest Reviews of Toyota Corolla 2024
                        </Title>
                        <Box className="give-review" my="xl">
                            <Grid>
                                <Grid.Col span={4}>
                                    <Box>
                                        <Flex align="center" gap="xs">
                                            <Rating size={rem(42)} defaultValue={1} count={1} />
                                            <Text size={rem(42)} fw="700">
                                                {counts?.averageRating} .0
                                            </Text>
                                            <Text ml="xl">
                                                Based on {reviews?.length} <br /> User reviews
                                            </Text>
                                        </Flex>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Button
                                        style={{ backgroundColor: '#EB2321', color: 'white' }}
                                        size="lg"
                                        fullWidth
                                        onClick={() => {
                                            if (session) {
                                                openModal();
                                            } else {
                                                showNotification({
                                                    title: 'Please Log In',
                                                    message: 'You need to be logged in to write a review.',
                                                    color: 'red',
                                                });
                                            }
                                        }}
                                    >
                                        Write a Review
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Box className="reviews-by-tags" mb="xl">
                            <Group>
                                {/* {tagsArray.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant={item.isSelected ? "filled" : "default"}
                  color={item.isSelected ? "#EB2321" : "#333333"}
                  autoContrast
                  size="md"
                  fw={500}
                >
                  {item.name}
                </Button>
              );
            })} */}

                                {filterOptions && filterOptions.map((option) => {
                                    const isSelected = filter === option.type; // Check if the current filter matches the option type
                                    const count = reviews?.length ? counts[option?.countKey ?? "total"] : 0; // Safely access counts

                                    return (
                                        <Button
                                            variant={isSelected ? 'filled' : 'default'} // Apply active state styles
                                            color={isSelected ? '#EB2321' : '#333333'}
                                            autoContrast
                                            size="md"
                                            fw={500}
                                            key={option.type}
                                            onClick={() => setFilter(option.type)} // Update filter state on button click
                                        >
                                            {option.label} ({count})
                                        </Button>
                                    );
                                })}

                            </Group>
                        </Box>

                        <Box className="customer-reviews">
                            <Tabs defaultValue="Latest" color="#EB2321">
                                <Tabs.List>
                                    <Tabs.Tab
                                        value="Latest"
                                        p="md"
                                        px="xl"
                                        ff="heading"
                                        fw={600}
                                    >
                                        Latest
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="Latest" py="xl">
                                    <Carousel
                                        loop
                                        withControls={true}
                                        controlsOffset="xl"
                                        controlSize={40}
                                        slideSize="33.33333%"
                                        slideGap="none"
                                        align="start"
                                        slidesToScroll={3}
                                    >
                                        {reviews?.map((review, index) => {

                                            return (
                                                <Carousel.Slide key={index}>
                                                    <Card
                                                        shadow="0px 4px 20px 0px rgba(0, 0, 0, 0.08)"
                                                        padding="lg"
                                                        m="md"
                                                    >
                                                        <Group mb="md">
                                                            <Rating value={review?.overAllRating} count={5} />
                                                            <Text span inherit c="dimmed" size="sm">
                                                                {review?.vehicle}
                                                            </Text>
                                                        </Group>
                                                        <Group gap={5}>
                                                            <Title order={4} lineClamp={1}>
                                                                {review?.title}
                                                            </Title>
                                                            <Text c="dimmed" lineClamp={3}>
                                                                {review?.comment}
                                                            </Text>
                                                            <Anchor href="#" c="#EB2321">
                                                                Read More
                                                            </Anchor>
                                                        </Group>

                                                        <Box className="review-card-footer" mt="md">
                                                            <Text>By pooja kate</Text>
                                                            <Text c="dimmed">{formatToMonthYear(review?.createdAt)} | 62 Views</Text>
                                                        </Box>
                                                    </Card>
                                                </Carousel.Slide>
                                            );
                                        })}
                                    </Carousel>
                                </Tabs.Panel>
                            </Tabs>
                        </Box>
                    </Card>
                </div>
            </section>
            <WriteReviewModal opened={isModalOpen} close={closeModal} fetchMakesByTypeData={fetchMakesByTypeData} fetchReviews={fetchReviews} />

        </>
    )
}

export default Comments