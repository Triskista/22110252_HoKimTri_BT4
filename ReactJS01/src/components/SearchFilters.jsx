import React, { useState, useEffect } from 'react';
import { Input, Select, Slider, Button, Row, Col, Card, Checkbox, Space, Collapse, Spin, Empty } from 'antd';
import { SearchOutlined, ClearOutlined, DollarOutlined, TagOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';
import { searchProductsApi, getCategoriesApi, getPriceStatsApi } from '../util/api';

const SearchFilters = ({ onSearch, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState(-1);
  const [stats, setStats] = useState({ minPrice: 0, maxPrice: 1000 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        if (res.EC === 0) {
          setCategories(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPriceStats = async () => {
      try {
        const res = await getPriceStatsApi();
        if (res.EC === 0) {
          setStats(res.data);
          setPriceRange([res.data.minPrice || 0, res.data.maxPrice || 1000]);
        }
      } catch (error) {
        console.error('Error fetching price stats:', error);
      }
    };

    fetchCategories();
    fetchPriceStats();
  }, []);

  const handleSearch = () => {
    const filters = {
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minDiscount,
      minRating,
      sortBy,
      sortOrder
    };
    onSearch(searchQuery, filters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([stats.minPrice || 0, stats.maxPrice || 1000]);
    setMinDiscount(0);
    setMinRating(0);
    setSortBy('relevance');
    setSortOrder(-1);
    onSearch('', {});
  };

  return (
    <Card style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid rgba(51, 65, 85, 0.6)',
      borderRadius: 12,
      marginBottom: 24
    }}>
      <h2 style={{ color: '#f1f5f9', marginBottom: 24, fontSize: 18, fontWeight: 600 }}>
        🔍 Tìm kiếm và lọc sản phẩm
      </h2>

      <Collapse
        items={[
          {
            key: '1',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}>Tìm kiếm</span>,
            children: (
              <div style={{ marginBottom: 16 }}>
                <Input
                  size="large"
                  placeholder="Nhập tên sản phẩm, danh mục, tag..."
                  prefix={<SearchOutlined />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  style={{
                    background: '#0f172a',
                    borderColor: '#334155',
                    color: '#f1f5f9'
                  }}
                />
              </div>
            )
          },
          {
            key: '2',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}>Danh mục</span>,
            children: (
              <Select
                mode="default"
                placeholder="Chọn danh mục"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { label: 'Tất cả danh mục', value: null },
                  ...categories.map(cat => ({
                    label: cat,
                    value: cat
                  }))
                ]}
                style={{ width: '100%' }}
              />
            )
          },
          {
            key: '3',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}><DollarOutlined /> Khoảng giá</span>,
            children: (
              <div>
                <Slider
                  range
                  min={stats.minPrice || 0}
                  max={stats.maxPrice || 1000}
                  value={priceRange}
                  onChange={setPriceRange}
                  step={10}
                  marks={{
                    [stats.minPrice || 0]: `$${stats.minPrice || 0}`,
                    [stats.maxPrice || 1000]: `$${stats.maxPrice || 1000}`
                  }}
                />
                <div style={{ marginTop: 16, color: '#cbd5e1' }}>
                  Giá: ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
            )
          },
          {
            key: '4',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}><TagOutlined /> Khuyến mãi</span>,
            children: (
              <Slider
                min={0}
                max={100}
                value={minDiscount}
                onChange={setMinDiscount}
                marks={{
                  0: '0%',
                  50: '50%',
                  100: '100%'
                }}
              />
            )
          },
          {
            key: '5',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}><StarOutlined /> Đánh giá</span>,
            children: (
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={setMinRating}
                marks={{
                  0: '0',
                  2.5: '2.5',
                  5: '5'
                }}
              />
            )
          },
          {
            key: '6',
            label: <span style={{ color: '#f1f5f9', fontWeight: 500 }}>Sắp xếp</span>,
            children: (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { label: 'Liên quan nhất', value: 'relevance' },
                    { label: 'Giá', value: 'price' },
                    { label: 'Lượt xem', value: 'views' },
                    { label: 'Đánh giá', value: 'rating' },
                    { label: 'Khuyến mãi', value: 'discount' },
                    { label: 'Mới nhất', value: 'newest' }
                  ]}
                  style={{ width: '100%' }}
                />
                <Select
                  value={sortOrder}
                  onChange={setSortOrder}
                  options={[
                    { label: 'Từ cao đến thấp', value: -1 },
                    { label: 'Từ thấp đến cao', value: 1 }
                  ]}
                  style={{ width: '100%' }}
                />
              </Space>
            )
          }
        ]}
        style={{
          background: 'transparent',
          border: 'none'
        }}
        defaultActiveKey={['1']}
      />

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12}>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSearch}
            icon={<SearchOutlined />}
            style={{
              fontSize: 14,
              height: 40,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
            }}
          >
            Tìm kiếm
          </Button>
        </Col>
        <Col xs={24} sm={12}>
          <Button
            size="large"
            block
            onClick={handleClear}
            icon={<ClearOutlined />}
            style={{
              fontSize: 14,
              height: 40,
              color: '#cbd5e1',
              borderColor: '#334155'
            }}
          >
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default SearchFilters;
