import React, { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, Search, FolderTree } from "lucide-react";

const CategoryTree = ({
  categories,
  selectedCategories = [],
  onCategoryChange,
  initialFilter,
}) => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Recursively transform categories into tree structure
  const transformCategoryData = (catList, level = 1) => {
    if (!Array.isArray(catList)) return [];

    return catList.map((category) => {
      const childrenList =
        category?.cat_active_childs ||
        category?.all_active_childs ||
        category?.all_childs ||
        category?.children ||
        category?.childs ||
        category?.sub_categories ||
        [];

      const name = category?.translations?.name ?? category?.name ?? "Category";

      return {
        title: name,
        key: category.id,
        level,
        image:
          category?.image_url ||
          category?.image ||
          category?.translations?.image_url,
        children:
          childrenList.length > 0
            ? transformCategoryData(childrenList, level + 1)
            : [],
      };
    });
  };

  // Initialize tree data when categories change
  useEffect(() => {
    if (categories?.length > 0) {
      const transformedData = transformCategoryData(categories, 1);
      setTreeData(transformedData);
    }
  }, [categories]);

  // Auto expand parent nodes when selectedCategories changes
  useEffect(() => {
    if (selectedCategories?.length > 0 && treeData?.length > 0) {
      const keysToExpand = [];
      const findParents = (nodes, currentPath = []) => {
        for (let node of nodes) {
          const newPath = [...currentPath, node.key];
          if (selectedCategories.includes(node.key)) {
            keysToExpand.push(...currentPath);
          }
          if (node.children?.length > 0) {
            findParents(node.children, newPath);
          }
        }
      };
      findParents(treeData);
      if (keysToExpand.length > 0) {
        setExpandedKeys((prev) => [...new Set([...prev, ...keysToExpand])]);
      }
    }
  }, [selectedCategories, treeData]);

  // Handle expand/collapse toggle
  const handleExpandCollapse = (nodeKey) => {
    setExpandedKeys((prev) =>
      prev.includes(nodeKey)
        ? prev.filter((key) => key !== nodeKey)
        : [...prev, nodeKey]
    );
  };

  // Expand all or Collapse all
  const toggleExpandAll = () => {
    const getAllKeys = (nodes) => {
      let keys = [];
      nodes.forEach((n) => {
        keys.push(n.key);
        if (n.children?.length > 0) {
          keys = [...keys, ...getAllKeys(n.children)];
        }
      });
      return keys;
    };

    const allKeys = getAllKeys(treeData);
    if (expandedKeys.length >= allKeys.length) {
      setExpandedKeys([]);
    } else {
      setExpandedKeys(allKeys);
    }
  };

  // Get all child keys for node
  const getAllChildKeys = (node) => {
    let keys = [];
    if (node.children?.length > 0) {
      node.children.forEach((child) => {
        keys.push(child.key);
        keys = [...keys, ...getAllChildKeys(child)];
      });
    }
    return keys;
  };

  // Handle checkbox check / uncheck
  const handleCheck = (checked, nodeKey, childKeys = []) => {
    let newSelected = Array.isArray(selectedCategories) ? [...selectedCategories] : [];

    if (checked) {
      newSelected = [...newSelected, nodeKey, ...childKeys];
    } else {
      const removeKeys = new Set([nodeKey, ...childKeys]);
      newSelected = newSelected.filter((key) => !removeKeys.has(key));
    }

    newSelected = [...new Set(newSelected)];
    onCategoryChange(newSelected);
  };

  // Filter tree data by search query
  const filterNodes = (nodes, query) => {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();

    return nodes
      .map((node) => {
        const matchesName = node.title.toLowerCase().includes(q);
        const filteredChildren = node.children ? filterNodes(node.children, query) : [];
        if (matchesName || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const visibleTreeData = useMemo(() => {
    return filterNodes(treeData, searchQuery);
  }, [treeData, searchQuery]);

  // Recursive component for Tree Node
  const TreeNode = ({ node }) => {
    const isExpanded = expandedKeys.includes(node.key) || searchQuery.trim().length > 0;
    const hasChildren = node.children?.length > 0;
    const isChecked = Array.isArray(selectedCategories) && selectedCategories.includes(node.key);
    const childKeys = getAllChildKeys(node);

    return (
      <div className={`my-0.5 transition-all ${node.level > 1 ? "ml-3 sm:ml-4 border-l border-slate-200 dark:border-slate-700/60 pl-2" : ""}`}>
        <div className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-colors group hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isChecked ? "bg-[#0BADFB]/10 text-[#0BADFB] font-bold" : ""}`}>
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
            onClick={() => handleCheck(!isChecked, node.key, childKeys)}
          >
            <Checkbox
              className="data-[state=checked]:bg-[#0BADFB] data-[state=checked]:border-[#0BADFB] border-slate-300 dark:border-slate-600 rounded-md"
              checked={isChecked}
              onCheckedChange={(checked) => handleCheck(checked, node.key, childKeys)}
            />

            <span className={`text-xs font-semibold truncate transition-colors ${isChecked ? "text-[#0BADFB] font-bold" : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900"}`}>
              {node.title}
            </span>
          </div>

          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCollapse(node.key);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-600 transition-colors ml-1 shrink-0"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minus className="h-3.5 w-3.5 text-[#0BADFB]" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children.map((child) => (
              <TreeNode key={child.key} node={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Search & Tree Actions Bar */}
      <div className="space-y-2 pb-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-[#0BADFB] transition-colors"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
          <span>Categories</span>
          <button
            type="button"
            onClick={toggleExpandAll}
            className="text-[10px] font-bold text-[#0BADFB] hover:underline cursor-pointer flex items-center gap-1"
          >
            <FolderTree size={12} />
            <span>{expandedKeys.length > 0 ? "Collapse" : "Expand"} All</span>
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
        {visibleTreeData.length > 0 ? (
          visibleTreeData.map((node) => (
            <TreeNode key={node.key} node={node} />
          ))
        ) : (
          <div className="py-6 text-center text-xs font-semibold text-slate-400">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTree;
