"use client";
import React, { Fragment, useState, useEffect, useRef } from "react";
// import classes from "@/app/styles/theme-css/Select.module.css";
import classes from "@/app/styles/theme-css/Checkbox.module.css";
import { ResetFiltersIcon, SearchWithCar } from "@/components/Icons";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Accordion,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Input,
  NumberInput,
  RangeSlider,
  rem,
  Select,
  Checkbox,
  Title,
  Text,
  Badge,
  Box,
  ScrollArea,
  Drawer,
  ActionIcon,
  CloseButton,
} from "@mantine/core";
import {
  cities,
  getVehiclePartsIconByVehicleType,
  vehicleConditionOptions,
  vehicleDriveOptions,
  vehicleExteriorColorOptions,
  vehicleFuelTypeOptions,
  vehicleTransmissionOptions,
} from "@/constants/vehicle-constants";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconSettings } from "@tabler/icons-react";
const ListingFilter = ({ type, makes, bodies, vehicles }) => {
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [filters, setFilters] = useState({
    query: "",
    city: [],
    search: "",
    condition: "",
    make: [],
    model: [],
    mileage: [0, 2000000],
    price: [0, 2000000000],
    year: [2000, 2024],
    transmission: "",
    drive: "",
    exteriorColor: "",
    fuelType: "",
    bodyType: [],
  });
  const router = useRouter();
  const { slug } = useParams();
  const debounceTimeoutRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (slug && slug.length > 0) {
      const updatedFilters = { ...filters };

      slug.forEach((item) => {
        if (item.startsWith("mk_")) {
          updatedFilters.make.push(item.replace("mk_", ""));
        }
        if (item.startsWith("md_")) {
          updatedFilters.model.push(item.replace("md_", ""));
        }
        if (item.startsWith("ct_")) {
          updatedFilters.city.push(item.replace("ct_", ""));
        }
        if (item.startsWith("bt_")) {
          updatedFilters.bodyType.push(item.replace("bt_", ""));
        }
        if (item.startsWith("pr_")) {
          const [min, max] = item.replace("pr_", "").split("_");
          updatedFilters.price = [parseInt(min, 10), parseInt(max, 10)];
        }
        if (item.startsWith("yr_")) {
          const [min, max] = item.replace("yr_", "").split("_");
          updatedFilters.year = [parseInt(min, 10), parseInt(max, 10)];
        }
        if (item.startsWith("ml_")) {
          const [min, max] = item.replace("ml_", "").split("_");
          updatedFilters.mileage = [parseInt(min, 10), parseInt(max, 10)];
        }
        if (item.startsWith("cn_")) {
          updatedFilters.condition = item;
        }
        if (item.startsWith("tr_")) {
          updatedFilters.transmission = item;
        }
        if (item.startsWith("dr_")) {
          updatedFilters.drive = item;
        }
        if (item.startsWith("cl_")) {
          updatedFilters.exteriorColor = item;
        }
        if (item.startsWith("ft_")) {
          updatedFilters.fuelType = item;
        }
        if (item.startsWith("q_")) {
          updatedFilters.query = item.replace("q_", "");
        }
        if (item.startsWith("od_")) {
          updatedFilters.order = item.replace("od_", "");
        }
        if (item.startsWith("page_")) {
          updatedFilters.page = parseInt(item.replace("page_", ""), 10);
        }
        if (item.startsWith("limit_")) {
          updatedFilters.limit = parseInt(item.replace("limit_", ""), 10);
        }
        if (item.startsWith("view_")) {
          updatedFilters.view = item.replace("view_", "");
        }
      });

      setFilters(updatedFilters);
    }
  }, []);
  const updateFiltersInUrl = (updatedFilters) => {
    let customUrl = `/listing/${type}/search/-/`;

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (key === "make")
          [...new Set(value)].forEach(
            (make) => (customUrl += `mk_${make.toLowerCase()}/`)
          );
        if (key === "model")
          [...new Set(value)].forEach(
            (model) => (customUrl += `md_${model.toLowerCase()}/`)
          );
        if (key === "city")
          [...new Set(value)].forEach(
            (city) => (customUrl += `ct_${city.toLowerCase()}/`)
          );
        if (key === "bodyType")
          [...new Set(value)].forEach(
            (bodyType) => (customUrl += `bt_${bodyType.toLowerCase()}/`)
          );
        if (key === "price" && (value[0] !== 0 || value[1] !== 2000000000)) {
          customUrl += `pr_${value[0]}_${value[1]}/`;
        }
        if (key === "year" && (value[0] !== 2000 || value[1] !== 2024)) {
          customUrl += `yr_${value[0]}_${value[1]}/`;
        }
        if (key === "mileage" && (value[0] !== 0 || value[1] !== 2000000)) {
          customUrl += `ml_${value[0]}_${value[1]}/`;
        }
      } else if (typeof value === "string" && value) {
        if (key === "query") customUrl += `q_${value}/`;
        if (
          [
            "condition",
            "transmission",
            "drive",
            "exteriorColor",
            "fuelType",
          ].includes(key)
        ) {
          customUrl += `${value}/`;
        }
        if (key === "view") customUrl += `view_${value}/`;
      } else if (typeof value === "number") {
        if (key === "page") customUrl += `page_${value}/`;
      }
    });
    const queryString = searchParams.toString();
    router.push(queryString ? `${customUrl}?${queryString}` : customUrl, {
      scroll: false,
    });
  };
  const handleFilterChange = (filterName, value, isChecked) => {
    setFilters((prevFilters) => {
      let updatedFilterValue;

      if (["make", "city", "model", "bodyType"].includes(filterName)) {
        const encodedValue = encodeURIComponent(value);
        if (isChecked) {
          updatedFilterValue = Array.from(
            new Set([...prevFilters[filterName], encodedValue])
          );
        } else {
          updatedFilterValue = prevFilters[filterName].filter(
            (item) => item !== encodedValue
          );
        }
      } else {
        updatedFilterValue = value;
      }

      const updatedFilters = {
        ...prevFilters,
        [filterName]: updatedFilterValue,
      };

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        updateFiltersInUrl(updatedFilters);
      }, 600);

      return updatedFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      city: [],
      search: "",
      condition: "",
      make: [],
      model: [],
      mileage: [0, 2000000],
      price: [0, 2000000000],
      year: [2000, 2024],
      transmission: "",
      drive: "",
      exteriorColor: "",
      fuelType: "",
      bodyType: [],
    });
    router.push(`/listing/${type}/search/-/`, { scroll: false });
  };
  const getModelsByMakes = () => {
    const selectedModels = [];
    makes?.data?.forEach((make) => {
      if (filters.make.includes(make?.name?.toLowerCase())) {
        make.models.forEach((model) => {
          selectedModels.push(model);
        });
      }
    });

    return selectedModels;
  };
  const getCountByTypeAndKey = (countType, key) => {
    if (!vehicles?.counts[countType]) {
      return null;
    }
    const normalizedKey = key?.toLowerCase();
    const entry = vehicles?.counts[countType].find(
      (item) => item._id.toLowerCase() === normalizedKey
    );
    return entry ? entry.count : null;
  };
  const decodedFilterMake = filters.make.map((make) =>
    decodeURIComponent(make).toLowerCase()
  );
  const decodedFilterModel = filters.model.map((model) =>
    decodeURIComponent(model).toLowerCase()
  );
  const decodedFilterBodies = filters.bodyType.map((body) =>
    decodeURIComponent(body).toLowerCase()
  );

  const data = cities.map((city) => city.label);

  return (
    <Fragment>
      <ActionIcon
        variant="filled"
        onClick={open}
        pos="fixed"
        left={0}
        size="md"
        top="30%"
        style={{
          zIndex: 10,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        display={{ base: "block", md: "none" }}
        aria-label="Settings"
        color="red"
      >
        <IconAdjustments style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      <Card
        shadow="4px 4px 20px 0px rgba(0, 0, 0, 0.0784313725)"
        mb="xl"
        visibleFrom="md"
      >
        <Card.Section c="white" bg="dark" p="lg" mb="lg">
          <Center>
            <SearchWithCar />
            <Title tt="uppercase" order={5} fw={600} c="white" ml="sm">
              Search Options
            </Title>
          </Center>
        </Card.Section>

        {/* City Filter */}
        <Accordion
          variant="contained"
          mb="lg"
          defaultValue={null}
          transitionDuration={500}
        >
          <Accordion.Item
            value="City"
            style={{ background: "white", borderColor: "#E3E3E3" }}
          >
            <Accordion.Control>
              <Text size="sm" fw={500}>
                City
              </Text>
            </Accordion.Control>
            <Accordion.Panel pt="sm">
              <ScrollArea
                h={350}
                scrollbarSize={6}
                scrollHideDelay={1000}
                offsetScrollbars
              >
                <div className="checkbox-group-filters">
                  {cities?.map((city) => (
                    <Box pos="relative" key={city.value}>
                      <Checkbox
                        mb="xs"
                        size="xs"
                        label={city.label}
                        key={city.value}
                        checked={filters.city.includes(city.value)}
                        onChange={(e) =>
                          handleFilterChange(
                            "city",
                            city.value,
                            e.target.checked
                          )
                        }
                      />
                      {getCountByTypeAndKey("cityCounts", city.label) && (
                        <Badge
                          pos="absolute"
                          right={0}
                          color="#E90808"
                          size="md"
                          fw={600}
                          variant="outline"
                        >
                          {getCountByTypeAndKey("cityCounts", city.label)}
                        </Badge>
                      )}
                    </Box>
                  ))}
                </div>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Make Filter */}
        <Accordion
          variant="contained"
          mb="lg"
          defaultValue="Make"
          transitionDuration={500}
        >
          <Accordion.Item
            value="Make"
            style={{ background: "white", borderColor: "#E3E3E3" }}
          >
            <Accordion.Control>
              <Text size="sm" fw={500}>
                Make
              </Text>
            </Accordion.Control>
            <Accordion.Panel pt="sm">
              {makes?.data?.map((make,index) => (
                <Box pos="relative" key={index}>
                  <Checkbox
                    mb="xs"
                    size="xs"
                    label={make.name}
                    key={make.value}
                    checked={decodedFilterMake.includes(
                      make?.name?.toLowerCase()
                    )}
                    onChange={(e) =>
                      handleFilterChange(
                        "make",
                        make?.name?.toLowerCase(),
                        e.target.checked
                      )
                    }
                  />
                  {getCountByTypeAndKey("makeCounts", make.label) && (
                    <Badge
                      pos="absolute"
                      right={0}
                      color="#E90808"
                      size="md"
                      fw={600}
                      variant="outline"
                    >
                      {getCountByTypeAndKey("makeCounts", make.label)}
                    </Badge>
                  )}
                </Box>
                //   <div className="form-check" key={make?.name?.toLowerCase()}>
                //    <input
                //     className="form-check-input"
                //     type="checkbox"
                //     id={make.name}
                //     checked={decodedFilterMake.includes(
                //       make?.name?.toLowerCase()
                //     )}
                //     onChange={(e) =>
                //       handleFilterChange(
                //         "make",
                //         make?.name?.toLowerCase(),
                //         e.target.checked
                //       )
                //     }
                //   />
                //   <label className="form-check-label" htmlFor={make.name}>
                //     {make.name}
                //   </label>
                //   {getCountByTypeAndKey("makeCounts", make.name) && (
                //     <div className="count">
                //       {getCountByTypeAndKey("makeCounts", make.name)}
                //     </div>

                //   )}
                // </div>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {filters.make?.length > 0 && (
          <Accordion
            variant="contained"
            mb="lg"
            defaultValue="Model"
            transitionDuration={500}
          >
            <Accordion.Item
              value="Model"
              style={{ background: "white", borderColor: "#E3E3E3" }}
            >
              <Accordion.Control>
                <Text size="sm" fw={500}>
                  Model
                </Text>
              </Accordion.Control>
              <Accordion.Panel pt="sm">
                {getModelsByMakes()?.map((model,index) => (
                <>
                  <Box pos="relative">
                    <Checkbox
                      mb="xs"
                      size="xs"
                      label={model.name}
                      key={index}
                      checked={decodedFilterModel.includes(
                        model.name?.toLowerCase()
                      )}
                      onChange={(e) =>
                        handleFilterChange(
                          "model",
                          model.name?.toLowerCase(),
                          e.target.checked
                        )
                      }
                    />
                    {getCountByTypeAndKey("modelCounts", model.label) && (
                      <Badge
                        pos="absolute"
                        right={0}
                        color="#E90808"
                        size="md"
                        fw={600}
                        variant="outline"
                      >
                        {getCountByTypeAndKey("modelCounts", model.label)}
                      </Badge>
                    )}
                  </Box>
                </>
                  //  <div className="form-check" key={model.name?.toLowerCase()}>
                  //  <input
                  //       className="form-check-input"
                  //       type="checkbox"
                  //       id={model.name}
                  //       checked={decodedFilterModel.includes(
                  //         model.name?.toLowerCase()
                  //       )}
                  //       onChange={(e) =>
                  //         handleFilterChange(
                  //           "model",
                  //           model.name?.toLowerCase(),
                  //           e.target.checked
                  //         )
                  //       }
                  //     />
                  //   <label className="form-check-label" htmlFor={model.name}>
                  //       {model.name}
                  //     </label>
                  //    {getCountByTypeAndKey("modelCounts", model.name) && (
                  //       <div className="count">
                  //         {getCountByTypeAndKey("modelCounts", model.name)}
                  //       </div>
                  //     )}
                  // </div>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}

        {/* Custom Range Slider for Mileage */}
        <Input.Wrapper mb="lg">
          <Input.Label>Mileage</Input.Label>
          <RangeSlider
            color="#E90808"
            min={0}
            max={2000000}
            value={filters.mileage}
            size="xs"
            my="xs"
            thumbSize={16}
            styles={{
              thumb: {
                borderWidth: rem(2),
                padding: rem(2),
                borderColor: "#FFF",
              },
            }}
            onChange={(value) => handleFilterChange("mileage", value)}
          />
          <Grid mt="md">
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.mileage[0]}
                min={0}
                max={filters.mileage[1]}
                onChange={(e) =>
                  handleFilterChange("mileage", [
                    Number(e.target.value),
                    filters.mileage[1],
                  ])
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.mileage[1]}
                max={200000000}
                onChange={(e) =>
                  handleFilterChange("mileage", [
                    filters.mileage[0],
                    Number(e.target.value),
                  ])
                }
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Input.Wrapper mb="lg">
          <Input.Label>Price</Input.Label>
          <RangeSlider
            color="#E90808"
            min={0}
            max={2000000000}
            value={filters.price}
            size="xs"
            my="xs"
            thumbSize={16}
            styles={{
              thumb: {
                borderWidth: rem(2),
                padding: rem(2),
                borderColor: "#FFF",
              },
            }}
            onChange={(value) => handleFilterChange("price", value)}
          />
          <Grid mt="md">
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.price[0]}
                min={0}
                max={filters.price[1]}
                onChange={(e) =>
                  handleFilterChange("price", [
                    Number(e.target.value),
                    filters.price[1],
                  ])
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.price[1]}
                min={filters.price[0]}
                max={2000000000}
                onChange={(e) =>
                  handleFilterChange("price", [
                    filters.price[0],
                    Number(e.target.value),
                  ])
                }
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Input.Wrapper mb="lg">
          <Input.Label>Year</Input.Label>
          <RangeSlider
            color="#E90808"
            size="xs"
            my="xs"
            thumbSize={16}
            styles={{
              thumb: {
                borderWidth: rem(2),
                padding: rem(2),
                borderColor: "#FFF",
              },
            }}
            min={2000}
            max={2024}
            value={filters.year}
            onChange={(value) => handleFilterChange("year", value)}
          />
          <Grid mt="md">
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.year[0]}
                min={2000}
                max={filters.year[1]}
                onChange={(e) =>
                  handleFilterChange("year", [
                    Number(e.target.value),
                    filters.year[1],
                  ])
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                value={filters.year[1]}
                min={filters.year[0]}
                max={2024}
                onChange={(e) =>
                  handleFilterChange("year", [
                    filters.year[0],
                    Number(e.target.value),
                  ])
                }
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Select
          mb="lg"
          placeholder="Condition"
          data={vehicleConditionOptions.map((condition) => ({
            value: condition.value,
            label: condition.label,
          }))}
          value={filters.condition}
          onChange={(value) => handleFilterChange("condition", value)}
          comboboxProps={{
            shadow: "lg",
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
        />

        <Select
          mb="lg"
          placeholder="Transmission"
          data={vehicleTransmissionOptions.map((transmission, index) => ({
            value: transmission.value,
            label: transmission.label,
          }))}
          value={filters.transmission}
          onChange={(value) => handleFilterChange("condition", value)}
          comboboxProps={{
            shadow: "lg",
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
        />

        <Select
          mb="lg"
          placeholder="Drive"
          data={vehicleDriveOptions.map((drive, index) => ({
            value: drive.value,
            label: drive.label,
          }))}
          value={filters.drive}
          onChange={(value) => handleFilterChange("drive", value)}
          comboboxProps={{
            shadow: "lg",
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
        />

        <Select
          mb="lg"
          placeholder="Exterior Color"
          data={vehicleExteriorColorOptions.map((color, index) => ({
            value: color.value,
            label: color.label,
          }))}
          value={filters.exteriorColor}
          onChange={(value) => handleFilterChange("exteriorColor", value)}
          comboboxProps={{
            shadow: "lg",
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
        />

        <Select
          mb="lg"
          placeholder="Fuel Type"
          data={vehicleFuelTypeOptions.map((fuel, index) => ({
            value: fuel.value,
            label: fuel.label,
          }))}
          value={filters.fuelType}
          onChange={(value) => handleFilterChange("fuelType", value)}
          comboboxProps={{
            shadow: "lg",
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
        />

        {/* <div className="range-inputs">
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.mileage[0]}
                    min={0}
                    max={filters.mileage[1]}
                    onChange={(e) =>
                      handleFilterChange("mileage", [
                        Number(e.target.value),
                        filters.mileage[1],
                      ])
                    }
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.mileage[1]}
                    max={200000000}
                    onChange={(e) =>
                      handleFilterChange("mileage", [
                        filters.mileage[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                </div>
              </div>
            </div>
          </div> */}
        {/* Custom Range Slider for Price */}
        {/* <div className="range-slider">
          <label htmlFor="price_range_slider" className="form-label">
            Price
          </label>
          <RangeSlider
            className="form-range mb-3"
            id="price_range_slider"
            color="red"
            thumbSize={18}
            min={0}
            max={2000000000}
            value={filters.price}
            size={3}
            onChange={(value) => handleFilterChange("price", value)}
            styles={{
              thumb: { borderWidth: 2, padding: 3, borderColor: "white" },
            }}
          />
          <div className="range-inputs">
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.price[0]}
                    min={0}
                    max={filters.price[1]}
                    onChange={(e) =>
                      handleFilterChange("price", [
                        Number(e.target.value),
                        filters.price[1],
                      ])
                    }
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.price[1]}
                    min={filters.price[0]}
                    max={2000000000}
                    onChange={(e) =>
                      handleFilterChange("price", [
                        filters.price[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* Custom Range Slider for Year */}
        {/* <div className="range-slider">
          <label htmlFor="year_range_slider" className="form-label">
            Year
          </label>
          <RangeSlider
            className="form-range mb-3"
            id="year_range_slider"
            color="red"
            thumbSize={18}
            min={2000}
            max={2024}
            value={filters.year}
            size={3}
            onChange={(value) => handleFilterChange("year", value)}
            styles={{
              thumb: { borderWidth: 2, padding: 3, borderColor: "white" },
            }}
          />
          <div className="range-inputs">
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.year[0]}
                    min={2000}
                    max={filters.year[1]}
                    onChange={(e) =>
                      handleFilterChange("year", [
                        Number(e.target.value),
                        filters.year[1],
                      ])
                    }
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={filters.year[1]}
                    min={filters.year[0]}
                    max={2024}
                    onChange={(e) =>
                      handleFilterChange("year", [
                        filters.year[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="extended-filters">
           <div className="form-group mb-3">
            <select
              className="form-select"
              value={filters.transmission}
              onChange={(e) =>
                handleFilterChange("transmission", e.target.value)
              }
            >
              <option value="" disabled>
                Transmission
              </option>
              {vehicleTransmissionOptions.map((transmission, index) => (
                <option value={transmission.value} key={index}>
                  {transmission.label}
                </option>
              ))}
            </select>
          </div> 
           <div className="form-group mb-3">
            <select
              className="form-select"
              value={filters.drive}
              onChange={(e) => handleFilterChange("drive", e.target.value)}
            >
              <option value="" disabled>
                Drive
              </option>
              {vehicleDriveOptions.map((drive, index) => (
                <option value={drive.value} key={index}>
                  {drive.label}
                </option>
              ))}
            </select>
          </div> 
           <div className="form-group mb-3">
            <select
              className="form-select"
              value={filters.exteriorColor}
              onChange={(e) =>
                handleFilterChange("exteriorColor", e.target.value)
              }
            >
              <option value="" disabled>
                Exterior Color
              </option>
              {vehicleExteriorColorOptions.map((color, index) => (
                <option value={color.value} key={index}>
                  {color.label}
                </option>
              ))}
            </select>
          </div> 
           <div className="form-group mb-3">
            <select
              className="form-select"
              value={filters.fuelType}
              onChange={(e) => handleFilterChange("fuelType", e.target.value)}
            >
              <option value="" disabled>
                Fuel Type
              </option>
              {vehicleFuelTypeOptions.map((fuel, index) => (
                <option value={fuel.value} key={index}>
                  {fuel.label}
                </option>
              ))}
            </select>
          </div> 
        </div> */}
        <Button
          color="#E90808"
          mt="md"
          autoContrast
          onClick={resetFilters}
          leftSection={<ResetFiltersIcon />}
          fullWidth
          fw={500}
          ff="heading"
          size="md"
        >
          Reset Filters
        </Button>
      </Card>
      <Card
        shadow="4px 4px 20px 0px rgba(0, 0, 0, 0.0784313725)"
        visibleFrom="md"
      >
        <Card.Section c="white" bg="dark" p="lg" mb="lg">
          <Center>
            {getVehiclePartsIconByVehicleType(type)}
            <Title tt="uppercase" ml="sm" order={5} fw={600} c="white">
              Body
            </Title>
          </Center>
        </Card.Section>
        <div className="filter-card">
          <Grid mb="lg">
            {bodies?.data?.map((bodyType,index) => (
              <>
              <Grid.Col span={6} ta="center" key={index}>
                <div className="single-brand-item selected-brand-item text-center">
                  <label
                    className={`text-decoration-none ${decodedFilterBodies.includes(
                      bodyType?.name?.toLowerCase()
                    )
                        ? "checked"
                        : ""
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="bodyType"
                      value={bodyType.name?.toLowerCase()}
                      checked={decodedFilterBodies.includes(
                        bodyType?.name?.toLowerCase()
                      )}
                      onChange={(e) =>
                        handleFilterChange(
                          "bodyType",
                          bodyType.name?.toLowerCase(),
                          e.target.checked
                        )
                      }
                    />
                    <Image
                      width={80}
                      height={60}
                      src={bodyType.bodyImage}
                      className="mx-auto text-center"
                      alt={`${bodyType.name} body type`}

                    />
                    <h6 className="mb-0 text-dark">{bodyType.name}</h6>
                  </label>
                </div>
              </Grid.Col>

              </>
            ))}
          </Grid>
        </div>
      </Card>
      <Drawer.Root size="xs" opened={opened} onClose={close}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header c="white" bg="dark" mb="md">
            <Drawer.Title>
              <Group>
                <SearchWithCar />
                <Title tt="uppercase" order={5} fw={600}>
                  Search Options
                </Title>
              </Group>
            </Drawer.Title>
            <Drawer.CloseButton color="white" c="white" />
          </Drawer.Header>
          <Drawer.Body p={0}>
            <Card mb="md">
              {/* City Filter */}
              <Accordion
                variant="contained"
                mb="lg"
                defaultValue={null}
                transitionDuration={500}
              >
                <Accordion.Item
                  value="City"
                  style={{ background: "white", borderColor: "#E3E3E3" }}
                >
                  <Accordion.Control>
                    <Text size="sm" fw={500}>
                      City
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel pt="sm">
                    <ScrollArea
                      h={350}
                      scrollbarSize={6}
                      scrollHideDelay={1000}
                      offsetScrollbars
                    >
                      <div className="checkbox-group-filters">
                        {cities?.map((city, index) => (
                          <Box pos="relative" key={index}>
                            <Checkbox
                              mb="xs"
                              size="xs"
                              label={city.label}
                              key={city.value}
                              checked={filters.city.includes(city.value)}
                              onChange={(e) =>
                                handleFilterChange(
                                  "city",
                                  city.value,
                                  e.target.checked
                                )
                              }
                            />
                            {getCountByTypeAndKey("cityCounts", city.label) && (
                              <Badge
                                pos="absolute"
                                right={0}
                                color="#E90808"
                                size="md"
                                fw={600}
                                variant="outline"
                              >
                                {getCountByTypeAndKey("cityCounts", city.label)}
                              </Badge>
                            )}
                          </Box>
                        ))}
                      </div>
                    </ScrollArea>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              {/* Make Filter */}
              <Accordion
                variant="contained"
                mb="lg"
                defaultValue="Make"
                transitionDuration={500}
              >
                <Accordion.Item
                  value="Make"
                  style={{ background: "white", borderColor: "#E3E3E3" }}
                >
                  <Accordion.Control>
                    <Text size="sm" fw={500}>
                      Make
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel pt="sm">
                    {makes?.data?.map((make, index) => (
                      <>
                        <Box pos="relative" key={index}>
                          <Checkbox
                            mb="xs"
                            size="xs"
                            label={make.name}
                            key={make.value}
                            checked={decodedFilterMake.includes(
                              make?.name?.toLowerCase()
                            )}
                            onChange={(e) =>
                              handleFilterChange(
                                "make",
                                make?.name?.toLowerCase(),
                                e.target.checked
                              )
                            }
                          />
                          {getCountByTypeAndKey("makeCounts", make.label) && (
                            <Badge
                              pos="absolute"
                              right={0}
                              color="#E90808"
                              size="md"
                              fw={600}
                              variant="outline"
                            >
                              {getCountByTypeAndKey("makeCounts", make.label)}
                            </Badge>
                          )}
                        </Box>
                      </>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              {filters.make?.length > 0 && (
                <Accordion
                  variant="contained"
                  mb="lg"
                  defaultValue="Model"
                  transitionDuration={500}
                >
                  <Accordion.Item
                    value="Model"
                    style={{ background: "white", borderColor: "#E3E3E3" }}
                  >
                    <Accordion.Control>
                      <Text size="sm" fw={500}>
                        Model
                      </Text>
                    </Accordion.Control>
                    <Accordion.Panel pt="sm">
                      {getModelsByMakes()?.map((model,index) => (
                       <>
                        <Box pos="relative" key={index}>
                          <Checkbox
                            mb="xs"
                            size="xs"
                            label={model.name}
                            key={model.value}
                            checked={decodedFilterModel.includes(
                              model.name?.toLowerCase()
                            )}
                            onChange={(e) =>
                              handleFilterChange(
                                "model",
                                model.name?.toLowerCase(),
                                e.target.checked
                              )
                            }
                          />
                          {getCountByTypeAndKey("modelCounts", model.label) && (
                            <Badge
                              pos="absolute"
                              right={0}
                              color="#E90808"
                              size="md"
                              fw={600}
                              variant="outline"
                            >
                              {getCountByTypeAndKey("modelCounts", model.label)}
                            </Badge>
                          )}
                        </Box>
                       </>
                      ))}
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              )}

              <Input.Wrapper mb="lg">
                <Input.Label>Mileage</Input.Label>
                <RangeSlider
                  color="#E90808"
                  min={0}
                  max={2000000}
                  value={filters.mileage}
                  size="xs"
                  my="xs"
                  thumbSize={16}
                  styles={{
                    thumb: {
                      borderWidth: rem(2),
                      padding: rem(2),
                    },
                  }}
                  onChange={(value) => handleFilterChange("mileage", value)}
                />
                <Grid mt="md">
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.mileage[0]}
                      min={0}
                      max={filters.mileage[1]}
                      onChange={(e) =>
                        handleFilterChange("mileage", [
                          Number(e.target.value),
                          filters.mileage[1],
                        ])
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.mileage[1]}
                      max={200000000}
                      onChange={(e) =>
                        handleFilterChange("mileage", [
                          filters.mileage[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>

              <Input.Wrapper mb="lg">
                <Input.Label>Price</Input.Label>
                <RangeSlider
                  color="#E90808"
                  min={0}
                  max={2000000000}
                  value={filters.price}
                  size="xs"
                  my="xs"
                  thumbSize={16}
                  styles={{
                    thumb: {
                      borderWidth: rem(2),
                      padding: rem(2),
                    },
                  }}
                  onChange={(value) => handleFilterChange("price", value)}
                />
                <Grid mt="md">
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.price[0]}
                      min={0}
                      max={filters.price[1]}
                      onChange={(e) =>
                        handleFilterChange("price", [
                          Number(e.target.value),
                          filters.price[1],
                        ])
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.price[1]}
                      min={filters.price[0]}
                      max={2000000000}
                      onChange={(e) =>
                        handleFilterChange("price", [
                          filters.price[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>

              <Input.Wrapper mb="lg">
                <Input.Label>Year</Input.Label>
                <RangeSlider
                  color="#E90808"
                  size="xs"
                  my="xs"
                  thumbSize={16}
                  styles={{
                    thumb: {
                      borderWidth: rem(2),
                      padding: rem(2),
                    },
                  }}
                  min={2000}
                  max={2024}
                  value={filters.year}
                  onChange={(value) => handleFilterChange("year", value)}
                />
                <Grid mt="md">
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.year[0]}
                      min={2000}
                      max={filters.year[1]}
                      onChange={(e) =>
                        handleFilterChange("year", [
                          Number(e.target.value),
                          filters.year[1],
                        ])
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      hideControls
                      value={filters.year[1]}
                      min={filters.year[0]}
                      max={2024}
                      onChange={(e) =>
                        handleFilterChange("year", [
                          filters.year[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>

              <Select
                mb="lg"
                placeholder="Condition"
                data={vehicleConditionOptions.map((condition) => ({
                  value: condition.value,
                  label: condition.label,
                }))}
                value={filters.condition}
                onChange={(value) => handleFilterChange("condition", value)}
                comboboxProps={{
                  shadow: "lg",
                  transitionProps: { transition: "fade-down", duration: 200 },
                }}
              />

              <Select
                mb="lg"
                placeholder="Transmission"
                data={vehicleTransmissionOptions.map((transmission) => ({
                  value: transmission.value,
                  label: transmission.label,
                }))}
                value={filters.transmission}
                onChange={(value) => handleFilterChange("transmission", value)}
                // Changed from "condition" to "transmission"
                comboboxProps={{
                  shadow: "lg",
                  transitionProps: { transition: "fade-down", duration: 200 },
                }}
              />

              <Select
                mb="lg"
                placeholder="Drive"
                data={vehicleDriveOptions.map((drive, index) => ({
                  value: drive.value,
                  label: drive.label,
                }))}
                value={filters.drive}
                onChange={(value) => handleFilterChange("drive", value)}
                comboboxProps={{
                  shadow: "lg",
                  transitionProps: { transition: "fade-down", duration: 200 },
                }}
              />

              <Select
                mb="lg"
                placeholder="Exterior Color"
                data={vehicleExteriorColorOptions.map((color, index) => ({
                  value: color.value,
                  label: color.label,
                }))}
                value={filters.exteriorColor}
                onChange={(value) => handleFilterChange("exteriorColor", value)}
                comboboxProps={{
                  shadow: "lg",
                  transitionProps: { transition: "fade-down", duration: 200 },
                }}
              />

              <Select
                mb="lg"
                placeholder="Fuel Type"
                data={vehicleFuelTypeOptions.map((fuel, index) => ({
                  value: fuel.value,
                  label: fuel.label,
                }))}
                value={filters.fuelType}
                onChange={(value) => handleFilterChange("fuelType", value)}
                comboboxProps={{
                  shadow: "lg",
                  transitionProps: { transition: "fade-down", duration: 200 },
                }}
              />
              <Button
                color="#E90808"
                mt="md"
                autoContrast
                onClick={resetFilters}
                leftSection={<ResetFiltersIcon />}
                fullWidth
                fw={500}
                ff="heading"
                size="md"
              >
                Reset Filters
              </Button>
            </Card>
            <Drawer.Header c="white" bg="dark" mb="md">
              <Drawer.Title>
                <Group>
                  {getVehiclePartsIconByVehicleType(type)}
                  <Title tt="uppercase" order={5} fw={600}>
                    Body
                  </Title>
                </Group>
              </Drawer.Title>
            </Drawer.Header>
            <Card>
              <div className="filter-card">
                <Grid mb="lg">
                  {bodies?.data?.map((bodyType,index) => (
                  <>
                    <Grid.Col span={6}  ta="center" key={index}>
                      <div className="single-brand-item selected-brand-item text-center">
                        <label
                          className={`text-decoration-none ${decodedFilterBodies.includes(
                            bodyType?.name?.toLowerCase()
                          )
                              ? "checked"
                              : ""
                            }`}
                        >
                          <input
                            type="checkbox"
                            name="bodyType"
                            value={bodyType.name?.toLowerCase()}
                            checked={decodedFilterBodies.includes(
                              bodyType?.name?.toLowerCase()
                            )}
                            onChange={(e) =>
                              handleFilterChange(
                                "bodyType",
                                bodyType.name?.toLowerCase(),
                                e.target.checked
                              )
                            }
                          />
                          <Image
                            width={80}
                            height={60}
                            src={bodyType.bodyImage}
                            className="mx-auto text-center"
                            alt={`${bodyType.name} body type`}

                          />
                          <h6 className="mb-0 text-dark">{bodyType.name}</h6>
                        </label>
                      </div>
                    </Grid.Col>
                  </>
                  ))}
                </Grid>
              </div>
            </Card>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Fragment>
  );
};

export default ListingFilter;
