import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiSettings,
} from "react-icons/fi";
import Hls from "hls.js";
import { apiService } from "../services/apiService";

import img from '../assets/thebox.png';

// ---------------- styled components ----------------
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;
`;
const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  padding: 0.75rem 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  cursor: pointer;
  margin-bottom: 2rem;
  transition: ${(props) => props.theme.transitions.fast};
  &:hover {
    background: ${(props) => props.theme.colors.card};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;
const PlayerSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-bottom: 2rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
const VideoContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  overflow: hidden;
  position: relative;
`;
const VideoPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${(props) => props.theme.colors.background};
  position: relative;
  video {
    width: 100%;
    height: 100%;
    background: black;
  }
`;
const PlayerControls = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;
const ControlButton = styled.button`
  background: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.small};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.fast};
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }
  &.active {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;
const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const VolumeSlider = styled.input`
  width: 100px;
  height: 4px;
  background: ${(props) => props.theme.colors.border};
  border-radius: 2px;
  outline: none;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
  }
`;
const ChannelInfoPanel = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: 1.5rem;
  height: fit-content;
`;
const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;
const ChannelLogo = styled.div`
  width: 80px;
  height: 80px;
  background: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .placeholder {
    font-size: 2rem;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;
const ChannelDetails = styled.div`
  flex: 1;
`;
const ChannelName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
`;
const ChannelMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const MetaTag = styled.span`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 500;
`;
const ChannelDescription = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;
const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;
const InfoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
`;
const InfoContent = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;
const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.error};
`;

// ---------------- component ----------------
const ChannelPlayer = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [channel, setChannel] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (channelId) fetchChannelData();
  }, [channelId]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [channelData, streamData] = await Promise.all([
        apiService.getChannel(channelId),
        apiService.getChannelStream(channelId),
      ]);
      setChannel(channelData);
      setStreamUrl(streamData);
    } catch (err) {
      console.error("Error fetching channel:", err);
      setError("Failed to load channel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // HLS.js setup
  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  const handleBack = () => navigate(-1);
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };
  const toggleMute = () => setMuted(!muted);
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setMuted(newVolume === 0);
  };
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (loading)
    return (
      <LoadingSpinner>
        <div>Loading channel...</div>
      </LoadingSpinner>
    );

  if (error)
    return (
      <PageContainer>
        <BackButton onClick={handleBack} whileHover={{ x: -5 }}>
          <FiArrowLeft /> Back
        </BackButton>
        <ErrorMessage>
          <h2>Error</h2>
          <p>{error}</p>
        </ErrorMessage>
      </PageContainer>
    );

  if (!channel || !streamUrl)
    return (
      <PageContainer>
        <BackButton onClick={handleBack} whileHover={{ x: -5 }}>
          <FiArrowLeft /> Back
        </BackButton>
        <ErrorMessage>
          <h2>Channel Not Found</h2>
          <p>The requested channel could not be found.</p>
        </ErrorMessage>
      </PageContainer>
    );

  return (
    <PageContainer>
      <BackButton onClick={handleBack} whileHover={{ x: -5 }}>
        <FiArrowLeft /> Back to Channels
      </BackButton>

      <PlayerSection>
        <VideoContainer>
          <VideoPlayer>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              controls={false}
              muted={muted}
              style={{ width: "100%", height: "100%" }}
            />
          </VideoPlayer>

          <PlayerControls>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ControlButton onClick={togglePlay}>
                {playing ? <FiPause /> : <FiPlay />}
              </ControlButton>
            </div>

            <VolumeControl>
              <ControlButton onClick={toggleMute}>
                {muted ? <FiVolumeX /> : <FiVolume2 />}
              </ControlButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </VolumeControl>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ControlButton onClick={handleFullscreen}>
                <FiMaximize />
              </ControlButton>
              <ControlButton>
                <FiSettings />
              </ControlButton>
            </div>
          </PlayerControls>
        </VideoContainer>

        <ChannelInfoPanel>
          <ChannelHeader>
            <ChannelLogo>
              {channel.logoUrl ? (
                <img src={img} alt={channel.name} />
              ) : (
                <div className="placeholder">📺</div>
              )}
            </ChannelLogo>
            <ChannelDetails>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelMeta>
                {channel.category && <MetaTag>{channel.category}</MetaTag>}
                {channel.language && <MetaTag>{channel.language}</MetaTag>}
                <MetaTag>{channel.countryCode}</MetaTag>
              </ChannelMeta>
            </ChannelDetails>
          </ChannelHeader>
          <ChannelDescription>
            {channel.name} is a television channel available on TheBox.
          </ChannelDescription>
          <InfoSection>
            <InfoTitle>Stream Information</InfoTitle>
            <InfoContent>
              <div>Status: <span style={{ color: "#10b981" }}>● Live</span></div>
              <div>Quality: Auto</div>
              <div>
                Last Updated:{" "}
                {new Date(channel.updatedAt).toLocaleDateString()}
              </div>
            </InfoContent>
          </InfoSection>
          {channel.epgId && (
            <InfoSection>
              <InfoTitle>EPG ID</InfoTitle>
              <InfoContent>{channel.epgId}</InfoContent>
            </InfoSection>
          )}
        </ChannelInfoPanel>
      </PlayerSection>
    </PageContainer>
  );
};

export default ChannelPlayer;